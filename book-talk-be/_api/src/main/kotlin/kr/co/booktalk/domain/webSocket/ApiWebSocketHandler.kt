package kr.co.booktalk.domain.webSocket

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import io.github.oshai.kotlinlogging.KotlinLogging
import kr.co.booktalk.domain.debate.*
import org.springframework.stereotype.Component
import org.springframework.web.socket.CloseStatus
import org.springframework.web.socket.TextMessage
import org.springframework.web.socket.WebSocketSession
import org.springframework.web.socket.handler.TextWebSocketHandler
import java.util.concurrent.ConcurrentHashMap

// TODO: 추 후 webSocket 모듈 제거. 도메인 단위로 모두 나누기
@Component
class ApiWebSocketHandler(
    private val presenceService: PresenceService,
    private val objectMapper: ObjectMapper
) : TextWebSocketHandler() {
    private val logger = KotlinLogging.logger {}

    /** WebSocketSession을 in-memory로 관리 */
    private val localSessions = ConcurrentHashMap<String, WebSocketSession>()

    /** 토론방별 손든 사용자 정보를 in-memory로 관리 (debateId -> (accountId -> RaisedHandInfo)) */
    private val raisedHands = ConcurrentHashMap<String, ConcurrentHashMap<String, RaisedHandInfo>>()

    data class RaisedHandInfo(
        val accountId: String,
        val accountName: String,
        val raisedAt: Long
    )

    /** WebSocket 연결 수립 시 세션을 등록하고 로그를 기록합니다. */
    override fun afterConnectionEstablished(session: WebSocketSession) {
        localSessions[session.id] = session
    }

    /** 클라이언트로부터 수신된 텍스트 메시지를 파싱하고 타입별로 처리합니다. */
    override fun handleTextMessage(session: WebSocketSession, message: TextMessage) {
        try {
            // 먼저 type 필드만 추출
            val typeMap = objectMapper.readValue<Map<String, Any>>(message.payload)
            val messageType = typeMap["type"] as? String

            when (messageType) {
                "C_JOIN_DEBATE" -> {
                    val request = objectMapper.readValue<WS_JoinDebateRequest>(message.payload)
                    handleJoinDebate(session, request)
                }

                "C_LEAVE_DEBATE" -> {
                    val request = objectMapper.readValue<WS_LeaveDebateRequest>(message.payload)
                    handleLeaveDebate(session, request)
                }

                "C_HEARTBEAT" -> {
                    val request = objectMapper.readValue<WS_HeartbeatRequest>(message.payload)
                    handleHeartbeat(session, request)
                }

                "C_TOGGLE_HAND" -> {
                    val request = objectMapper.readValue<WS_ToggleHandRequest>(message.payload)
                    handleToggleHand(session, request)
                }

                "C_CHAT_MESSAGE" -> {
                    val request = objectMapper.readValue<WS_ChatMessageRequest>(message.payload)
                    handleChatMessage(session, request)
                }

                else -> logger.warn { "알 수 없는 메시지 타입: $messageType" }
            }
        } catch (e: Exception) {
            logger.error(e) { "메시지 처리 실패: ${message.payload}" }
        }
    }

    /** WebSocket 연결 종료 시 세션을 정리합니다. */
    override fun afterConnectionClosed(session: WebSocketSession, status: CloseStatus) {
        cleanupSession(session, status)
        localSessions.remove(session.id)
    }

    /** 토론방 참여 요청을 처리합니다. 사용자 인증, 유효성 검사를 거쳐 토론방에 참여시킵니다. */
    private fun handleJoinDebate(session: WebSocketSession, request: WS_JoinDebateRequest) {
        val authenticatedAccountId = getAuthenticatedAccountId(session) ?: return

        if (!validateAccountIdMatch(authenticatedAccountId, request.accountId)) {
            return
        }

        registerAccountSession(session, authenticatedAccountId, request.debateId)
        joinDebateWithErrorHandling(session, request.debateId, authenticatedAccountId, request.accountName)
    }

    /** 토론방 나가기 요청을 처리합니다. 사용자를 토론방에서 제거하고 세션을 정리합니다. */
    private fun handleLeaveDebate(session: WebSocketSession, request: WS_LeaveDebateRequest) {
        val authenticatedAccountId = getAuthenticatedAccountId(session) ?: return
        leaveDebateAndCleanup(session, request.debateId, authenticatedAccountId)
    }

    /** 클라이언트의 하트비트 요청을 처리하고 응답을 보냅니다. */
    private fun handleHeartbeat(session: WebSocketSession, @Suppress("UNUSED_PARAMETER") request: WS_HeartbeatRequest) {
        val authenticatedAccountId = getAuthenticatedAccountId(session) ?: return

        try {
            presenceService.updateHeartbeat(authenticatedAccountId)
            sendHeartbeatResponse(session)
        } catch (e: Exception) {
            logger.error(e) { "Heartbeat 처리 실패: accountId=$authenticatedAccountId" }
        }
    }

    /** 세션에서 인증된 계정 ID를 추출합니다. */
    private fun getAuthenticatedAccountId(session: WebSocketSession): String? {
        return session.attributes["accountId"] as? String
    }

    /** 요청된 계정 ID와 인증된 계정 ID가 일치하는지 검증합니다. */
    private fun validateAccountIdMatch(authenticatedAccountId: String, requestedAccountId: String): Boolean {
        return if (requestedAccountId != authenticatedAccountId) {
            logger.warn { "계정 ID 불일치: authenticated=$authenticatedAccountId, requested=$requestedAccountId" }
            false
        } else {
            true
        }
    }

    /** 세션에 계정과 토론방 정보를 등록합니다. */
    private fun registerAccountSession(session: WebSocketSession, @Suppress("UNUSED_PARAMETER") accountId: String, debateId: String) {
        // 세션 속성에 debateId 저장
        session.attributes["debateId"] = debateId
    }

    /** 토론 참여 처리를 에러 핸들링과 함께 수행합니다. */
    private fun joinDebateWithErrorHandling(
        session: WebSocketSession,
        debateId: String,
        accountId: String,
        accountName: String
    ) {
        try {
            presenceService.joinDebate(debateId, accountId, accountName)
            sendJoinSuccessResponse(session, debateId, accountId)

            // Redis Pub/Sub을 통해 즉시 브로드캐스트
            publishPresenceUpdate(debateId)

        } catch (e: Exception) {
            logger.error(e) { "토론 참여 처리 실패: debateId=$debateId, accountId=$accountId" }
            sendJoinErrorResponse(session, debateId, accountId, e.message ?: "UNKNOWN_ERROR")
        }
    }

    /** 토론 나가기 처리와 세션 정리를 수행합니다. */
    private fun leaveDebateAndCleanup(session: WebSocketSession, debateId: String, accountId: String) {
        try {
            presenceService.leaveDebate(debateId, accountId)
            publishPresenceUpdate(debateId)
            removeAccountSession(session)
        } catch (e: Exception) {
            logger.error(e) { "토론 나가기 처리 실패: debateId=$debateId, accountId=$accountId" }
        }
    }

    /** 세션 정보를 제거합니다. */
    private fun removeAccountSession(session: WebSocketSession) {
        // 세션 속성에서 debateId 제거
        session.attributes.remove("debateId")
    }

    /** 연결 종료 시 세션과 관련된 모든 정보를 정리합니다. */
    private fun cleanupSession(session: WebSocketSession, @Suppress("UNUSED_PARAMETER") status: CloseStatus) {
        val accountId = session.attributes["accountId"] as? String
        val debateId = session.attributes["debateId"] as? String

        removeAccountSession(session)

        if (accountId != null && debateId != null) {
            try {
                presenceService.leaveDebate(debateId, accountId)
                // Redis Pub/Sub을 통해 모든 서버에 브로드캐스트
                publishPresenceUpdate(debateId)
            } catch (e: Exception) {
                logger.error(e) { "연결 종료 시 정리 실패: accountId=$accountId, debateId=$debateId" }
            }
        }
    }

    /** 토론 참여 성공 응답을 클라이언트에게 전송합니다. */
    private fun sendJoinSuccessResponse(session: WebSocketSession, debateId: String, accountId: String) {
        val response = WS_JoinSuccessResponse(debateId = debateId, accountId = accountId)
        sendMessage(session, response)
    }

    /** 토론 참여 실패 응답을 클라이언트에게 전송합니다. */
    private fun sendJoinErrorResponse(session: WebSocketSession, debateId: String, accountId: String, reason: String) {
        val response = WS_JoinErrorResponse(debateId = debateId, accountId = accountId, reason = reason)
        sendMessage(session, response)
    }

    /** 하트비트 응답을 클라이언트에게 전송합니다. */
    private fun sendHeartbeatResponse(session: WebSocketSession) {
        val response = WS_HeartbeatAckResponse(timestamp = System.currentTimeMillis())
        sendMessage(session, response)
    }

    /** 해당 토론방의 모든 WebSocket 세션에 presence 업데이트를 직접 브로드캐스트합니다. */
    private fun publishPresenceUpdate(debateId: String) {
        val onlineAccounts = presenceService.getOnlineAccounts(debateId)
        val response = WS_PresenceUpdateResponse(
            debateId = debateId,
            onlineAccounts = onlineAccounts.map { account ->
                WS_PresenceUpdateResponse.AccountPresenceInfo(
                    accountId = account.accountId,
                    accountName = account.accountName,
                    status = account.status.name,
                    lastHeartbeat = account.lastHeartbeat.toEpochMilli()
                )
            }
        )

        val messageJson = objectMapper.writeValueAsString(response)
        broadcastToDebateRoom(debateId, messageJson)
    }

    /** WebSocket 세션을 통해 클라이언트에게 메시지를 전송합니다. */
    private fun sendMessage(session: WebSocketSession, message: Any) {
        try {
            if (session.isOpen) {
                val messageJson = objectMapper.writeValueAsString(message)
                // WebSocket 메시지 전송은 thread-safe하지 않으므로 동기화 필요
                synchronized(session) {
                    if (session.isOpen) {
                        session.sendMessage(TextMessage(messageJson))
                    }
                }
            }
        } catch (e: Exception) {
            logger.error(e) { "메시지 전송 실패: sessionId=${session.id}" }
        }
    }

    /** 특정 토론방의 모든 WebSocket 세션에게 메시지를 직접 브로드캐스트합니다. */
    fun broadcastToDebateRoom(debateId: String, messageJson: String) {
        try {
            // localSessions에서 해당 토론방의 세션만 필터링하여 메시지 전송
            val targetSessions = localSessions.values.filter { session ->
                session.attributes["debateId"] == debateId
            }

            targetSessions.forEach { session ->
                sendTextMessage(session, messageJson)
            }

            logger.debug { "토론방 브로드캐스트 완료: debateId=$debateId, sessions=${targetSessions.size}" }
        } catch (e: Exception) {
            logger.error(e) { "토론방 브로드캐스트 실패: debateId=$debateId, messageJson=$messageJson" }
        }
    }

    /** 직접 JSON 문자열을 WebSocket으로 전송합니다. */
    private fun sendTextMessage(session: WebSocketSession, messageJson: String) {
        try {
            if (session.isOpen) {
                synchronized(session) {
                    if (session.isOpen) {
                        session.sendMessage(TextMessage(messageJson))
                    }
                }
            }
        } catch (e: Exception) {
            logger.error(e) { "메시지 전송 실패: sessionId=${session.id}" }
        }
    }

    /** 손들기 토글 요청을 처리합니다. */
    private fun handleToggleHand(session: WebSocketSession, request: WS_ToggleHandRequest) {
        val authenticatedAccountId = getAuthenticatedAccountId(session) ?: return

        if (!validateAccountIdMatch(authenticatedAccountId, request.accountId)) {
            return
        }

        val sessionDebateId = session.attributes["debateId"] as? String
        if (sessionDebateId == null || sessionDebateId != request.debateId) {
            logger.error { "손들기 요청 거부: 세션 방 불일치 sessionDebateId=$sessionDebateId, req=${request.debateId}" }
            return
        }

        try {
            val debateHands = raisedHands.getOrPut(request.debateId) { ConcurrentHashMap() }

            if (debateHands.containsKey(authenticatedAccountId)) {
                // 손 내리기: 메모리에서 삭제
                debateHands.remove(authenticatedAccountId)
            } else {
                // 손들기: 메모리에 저장
                debateHands[authenticatedAccountId] = RaisedHandInfo(
                    accountId = authenticatedAccountId,
                    accountName = request.accountName,
                    raisedAt = System.currentTimeMillis()
                )
            }

            // 손들기 상태 브로드캐스트
            publishHandRaiseUpdate(request.debateId)

        } catch (e: Exception) {
            logger.error(e) { "손들기 토글 처리 실패: debateId=${request.debateId}, accountId=$authenticatedAccountId" }
        }
    }

    /** 손들기 상태 업데이트를 토론방 모든 참가자에게 브로드캐스트합니다. */
    private fun publishHandRaiseUpdate(debateId: String) {
        try {
            // 메모리에서 현재 손든 사용자 목록 조회
            val debateHands = raisedHands[debateId] ?: emptyMap()

            val raisedHandsList = debateHands.values.map { handInfo ->
                WS_HandRaiseUpdateResponse.RaisedHandInfo(
                    accountId = handInfo.accountId,
                    accountName = handInfo.accountName,
                    raisedAt = handInfo.raisedAt
                )
            }

            val response = WS_HandRaiseUpdateResponse(
                debateId = debateId,
                raisedHands = raisedHandsList
            )

            val messageJson = objectMapper.writeValueAsString(response)
            broadcastToDebateRoom(debateId, messageJson)

            logger.debug { "손들기 상태 브로드캐스트 완료: debateId=$debateId, raisedHands=${raisedHandsList.size}" }
        } catch (e: Exception) {
            logger.error(e) { "손들기 상태 브로드캐스트 실패: debateId=$debateId" }
        }
    }

    /** 채팅 메시지를 토론방 모든 참가자에게 브로드캐스트합니다. */
    private fun handleChatMessage(session: WebSocketSession, request: WS_ChatMessageRequest) {
        val authenticatedAccountId = getAuthenticatedAccountId(session) ?: return
        val sessionDebateId = session.attributes["debateId"] as? String
        if (sessionDebateId == null || sessionDebateId != request.debateId) {
            logger.error { "채팅 요청 거부: 세션 방 불일치 sessionDebateId=$sessionDebateId, req=${request.debateId}, account=$authenticatedAccountId" }
            return
        }

        try {
            publishChatMessage(request.debateId, request.chatId)
        } catch (e: Exception) {
            logger.error(e) { "채팅 메시지 브로드캐스트 실패: debateId=${request.debateId}, chatId=${request.chatId}" }
        }
    }

    /** 채팅 메시지 업데이트를 토론방 모든 참가자에게 브로드캐스트합니다. */
    private fun publishChatMessage(debateId: String, chatId: Long) {
        val response = WS_ChatMessageResponse(
            debateId = debateId,
            chatId = chatId
        )

        val messageJson = objectMapper.writeValueAsString(response)
        broadcastToDebateRoom(debateId, messageJson)

        logger.debug { "채팅 메시지 브로드캐스트 완료: debateId=$debateId, chatId=$chatId" }
    }

}
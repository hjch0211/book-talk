package kr.co.booktalk.domain.webSocket

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import io.github.oshai.kotlinlogging.KotlinLogging
import jakarta.annotation.PreDestroy
import kotlinx.coroutines.*
import kr.co.booktalk.cache.HandRaiseCache
import kr.co.booktalk.cache.WebSocketSessionCache
import kr.co.booktalk.domain.debate.*
import org.springframework.stereotype.Component
import org.springframework.web.socket.CloseStatus
import org.springframework.web.socket.TextMessage
import org.springframework.web.socket.WebSocketSession
import org.springframework.web.socket.handler.TextWebSocketHandler
import java.time.Instant

// TODO: 추 후 webSocket 모듈 제거. 도메인 단위로 모두 나누기
@Component
class ApiWebSocketHandler(
    private val presenceService: PresenceService,
    private val handRaiseCache: HandRaiseCache,
    private val webSocketSessionCache: WebSocketSessionCache,
    private val objectMapper: ObjectMapper
) : TextWebSocketHandler() {
    private val logger = KotlinLogging.logger {}
    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.IO + CoroutineName("api-websocket-handler"))

    @PreDestroy
    fun destroy() {
        scope.cancel()
    }

    /** WebSocket 연결 수립 시 세션을 등록하고 로그를 기록합니다. */
    override fun afterConnectionEstablished(session: WebSocketSession) {
        val accountId = session.attributes["accountId"] as? String
        if (accountId != null) {
            webSocketSessionCache.add(accountId, session)
        }
    }

    /** 클라이언트로부터 수신된 텍스트 메시지를 파싱하고 타입별로 처리합니다. */
    override fun handleTextMessage(session: WebSocketSession, message: TextMessage) {
        try {
            // 먼저 type 필드만 추출
            val typeMap = objectMapper.readValue<Map<String, Any>>(message.payload)
            val messageType = typeMap["type"] as? String

            when (messageType) {
                WSRequestMessageType.C_JOIN_DEBATE.name -> {
                    val request = objectMapper.readValue<JoinDebateRequest>(message.payload)
                    handleJoinDebate(session, request)
                }

                WSRequestMessageType.C_LEAVE_DEBATE.name -> {
                    val request = objectMapper.readValue<LeaveDebateRequest>(message.payload)
                    handleLeaveDebate(session, request)
                }

                WSRequestMessageType.C_HEARTBEAT.name -> {
                    handleHeartbeat(session)
                }

                WSRequestMessageType.C_TOGGLE_HAND.name -> {
                    val request = objectMapper.readValue<ToggleHandRequest>(message.payload)
                    scope.launch { handleToggleHand(session, request) }
                }

                WSRequestMessageType.C_CHAT_MESSAGE.name -> {
                    val request = objectMapper.readValue<ChatMessageRequest>(message.payload)
                    handleChatMessage(session, request)
                }

                // WebRTC Signaling Messages (C_ = Client sends)
                WSRequestMessageType.C_VOICE_JOIN.name -> {
                    val request = objectMapper.readValue<VoiceJoinRequest>(message.payload)
                    handleVoiceJoin(session, request)
                }

                WSRequestMessageType.C_VOICE_OFFER.name -> {
                    val request = objectMapper.readValue<VoiceOfferRequest>(message.payload)
                    handleVoiceOffer(session, request)
                }

                WSRequestMessageType.C_VOICE_ANSWER.name -> {
                    val request = objectMapper.readValue<VoiceAnswerRequest>(message.payload)
                    handleVoiceAnswer(session, request)
                }

                WSRequestMessageType.C_VOICE_ICE_CANDIDATE.name -> {
                    val request = objectMapper.readValue<VoiceIceCandidateRequest>(message.payload)
                    handleVoiceIceCandidate(session, request)
                }

                else -> logger.warn { "알 수 없는 메시지 타입: $messageType" }
            }
        } catch (e: Exception) {
            logger.error(e) { "메시지 처리 실패: ${message.payload}" }
        }
    }

    /** WebSocket 연결 종료 시 세션을 정리합니다. */
    override fun afterConnectionClosed(session: WebSocketSession, status: CloseStatus) {
        cleanupSession(session)
        val accountId = session.attributes["accountId"] as? String
        if (accountId != null) {
            webSocketSessionCache.remove(accountId)
        }
    }

    /** 토론방 참여 요청을 처리합니다. 사용자 인증, 유효성 검사를 거쳐 토론방에 참여시킵니다. */
    private fun handleJoinDebate(session: WebSocketSession, request: JoinDebateRequest) {
        val payload = request.payload ?: return
        val authenticatedAccountId = getAuthenticatedAccountId(session) ?: return

        if (!validateAccountIdMatch(authenticatedAccountId, payload.accountId)) {
            return
        }

        registerAccountSession(session, payload.debateId)
        joinDebateWithErrorHandling(session, payload.debateId, authenticatedAccountId, payload.accountName, payload.voiceEnabled)
    }

    /** 토론방 나가기 요청을 처리합니다. 사용자를 토론방에서 제거하고 세션을 정리합니다. */
    private fun handleLeaveDebate(session: WebSocketSession, request: LeaveDebateRequest) {
        val payload = request.payload ?: return
        val authenticatedAccountId = getAuthenticatedAccountId(session) ?: return
        leaveDebateAndCleanup(session, payload.debateId, authenticatedAccountId)
    }

    /** 클라이언트의 하트비트 요청을 처리하고 응답을 보냅니다. */
    private fun handleHeartbeat(session: WebSocketSession) {
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
    private fun registerAccountSession(session: WebSocketSession, debateId: String) {
        // 세션 속성에 debateId 저장
        session.attributes["debateId"] = debateId
    }

    /** 토론 참여 처리를 에러 핸들링과 함께 수행합니다. */
    private fun joinDebateWithErrorHandling(
        session: WebSocketSession,
        debateId: String,
        accountId: String,
        accountName: String,
        voiceEnabled: Boolean = true
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
    private fun cleanupSession(session: WebSocketSession) {
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
        val response = JoinSuccessResponse(
            payload = JoinSuccessResponse.Payload(
                debateId = debateId,
                accountId = accountId
            )
        )
        sendMessage(session, response)
    }

    /** 토론 참여 실패 응답을 클라이언트에게 전송합니다. */
    private fun sendJoinErrorResponse(session: WebSocketSession, debateId: String, accountId: String, reason: String) {
        val response = JoinErrorResponse(
            payload = JoinErrorResponse.Payload(
                debateId = debateId,
                accountId = accountId,
                reason = reason
            )
        )
        sendMessage(session, response)
    }

    /** 하트비트 응답을 클라이언트에게 전송합니다. */
    private fun sendHeartbeatResponse(session: WebSocketSession) {
        val response = HeartbeatAckResponse(
            payload = HeartbeatAckResponse.Payload(
                timestamp = System.currentTimeMillis()
            )
        )
        sendMessage(session, response)
    }

    /** 해당 토론방의 모든 WebSocket 세션에 presence 업데이트를 직접 브로드캐스트합니다. */
    private fun publishPresenceUpdate(debateId: String) {
        val onlineAccounts = presenceService.getOnlineAccounts(debateId)
        val response = PresenceUpdateResponse(
            payload = PresenceUpdateResponse.Payload(
                debateId = debateId,
                onlineAccounts = onlineAccounts.map { account ->
                    PresenceUpdateResponse.Payload.AccountPresenceInfo(
                        accountId = account.accountId,
                        accountName = account.accountName,
                        status = account.status.name,
                        lastHeartbeat = account.lastHeartbeat.toEpochMilli()
                    )
                }
            )
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
            // presenceService에서 해당 토론방의 온라인 사용자 목록을 가져와서 세션 조회
            val onlineAccounts = presenceService.getOnlineAccounts(debateId)
            val accountIds = onlineAccounts.map { it.accountId }.toSet()
            val targetSessions = webSocketSessionCache.getAll(accountIds)

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
    private suspend fun handleToggleHand(session: WebSocketSession, request: ToggleHandRequest) {
        val payload = request.payload ?: return
        val authenticatedAccountId = getAuthenticatedAccountId(session) ?: return

        if (!validateAccountIdMatch(authenticatedAccountId, payload.accountId)) return

        val sessionDebateId = session.attributes["debateId"] as? String
        if (sessionDebateId != payload.debateId) {
            logger.error { "손들기 요청 거부: 세션 방 불일치" }
            return
        }

        val existing = handRaiseCache.get(payload.debateId, authenticatedAccountId)

        if (existing != null) {
            handRaiseCache.remove(payload.debateId, authenticatedAccountId)
        } else {
            handRaiseCache.add(payload.debateId, authenticatedAccountId, Instant.now())

            delay(3000)
            handRaiseCache.remove(payload.debateId, authenticatedAccountId)
        }

        publishHandRaiseUpdate(payload.debateId)
    }

    /** 손들기 상태 업데이트를 토론방 모든 참가자에게 브로드캐스트합니다. */
    private fun publishHandRaiseUpdate(debateId: String) {
        val onlineAccounts = presenceService.getOnlineAccounts(debateId)

        val raisedHandsList = onlineAccounts.mapNotNull { account ->
            val raisedAt = handRaiseCache.get(debateId, account.accountId)
                ?: return@mapNotNull null

            HandRaiseUpdateResponse.Payload.RaisedHandInfo(
                accountId = account.accountId,
                accountName = account.accountName,
                raisedAt = raisedAt.toEpochMilli()
            )
        }

        val response = HandRaiseUpdateResponse(
            payload = HandRaiseUpdateResponse.Payload(
                debateId = debateId,
                raisedHands = raisedHandsList
            )
        )

        val messageJson = objectMapper.writeValueAsString(response)
        broadcastToDebateRoom(debateId, messageJson)
    }

    /** 채팅 메시지를 토론방 모든 참가자에게 브로드캐스트합니다. */
    private fun handleChatMessage(session: WebSocketSession, request: ChatMessageRequest) {
        val payload = request.payload ?: return
        val authenticatedAccountId = getAuthenticatedAccountId(session) ?: return
        val sessionDebateId = session.attributes["debateId"] as? String
        if (sessionDebateId == null || sessionDebateId != payload.debateId) {
            logger.error { "채팅 요청 거부: 세션 방 불일치 sessionDebateId=$sessionDebateId, req=${payload.debateId}, account=$authenticatedAccountId" }
            return
        }

        try {
            publishChatMessage(payload.debateId, payload.chatId)
        } catch (e: Exception) {
            logger.error(e) { "채팅 메시지 브로드캐스트 실패: debateId=${payload.debateId}, chatId=${payload.chatId}" }
        }
    }

    /** 채팅 메시지 업데이트를 토론방 모든 참가자에게 브로드캐스트합니다. */
    private fun publishChatMessage(debateId: String, chatId: Long) {
        val response = ChatMessageResponse(
            payload = ChatMessageResponse.Payload(
                debateId = debateId,
                chatId = chatId
            )
        )

        val messageJson = objectMapper.writeValueAsString(response)
        broadcastToDebateRoom(debateId, messageJson)

        logger.debug { "채팅 메시지 브로드캐스트 완료: debateId=$debateId, chatId=$chatId" }
    }

    // ============ WebRTC Signaling Handlers ============

    /** 음성 채팅 참여 요청을 처리합니다. */
    private fun handleVoiceJoin(session: WebSocketSession, request: VoiceJoinRequest) {
        val payload = request.payload ?: return
        val authenticatedAccountId = getAuthenticatedAccountId(session) ?: return
        if (!validateAccountIdMatch(authenticatedAccountId, payload.accountId)) {
            return
        }

        val sessionDebateId = session.attributes["debateId"] as? String
        if (sessionDebateId != payload.debateId) {
            logger.error { "음성 참여 요청 거부: 세션 방 불일치 sessionDebateId=$sessionDebateId, req=${payload.debateId}" }
            return
        }

        try {
            logger.info { "음성 채팅 참여: debateId=${payload.debateId}, accountId=${payload.accountId}" }

            // 같은 토론방의 다른 참가자들에게 S_VOICE_JOIN 브로드캐스트
            val response = VoiceJoinResponse(
                payload = VoiceJoinResponse.Payload(
                    debateId = payload.debateId,
                    fromId = payload.accountId
                )
            )
            val messageJson = objectMapper.writeValueAsString(response)
            broadcastToDebateRoom(payload.debateId, messageJson)
        } catch (e: Exception) {
            logger.error(e) { "음성 참여 처리 실패: debateId=${payload.debateId}, accountId=${payload.accountId}" }
        }
    }

    /** WebRTC Offer를 특정 피어에게 전달합니다. */
    private fun handleVoiceOffer(session: WebSocketSession, request: VoiceOfferRequest) {
        val payload = request.payload ?: return
        val authenticatedAccountId = getAuthenticatedAccountId(session) ?: return
        if (!validateAccountIdMatch(authenticatedAccountId, payload.fromId)) {
            return
        }

        val sessionDebateId = session.attributes["debateId"] as? String
        if (sessionDebateId != payload.debateId) {
            logger.error { "Offer 요청 거부: 세션 방 불일치 sessionDebateId=$sessionDebateId, req=${payload.debateId}" }
            return
        }

        try {
            logger.debug { "Offer 전달: from=${payload.fromId}, to=${payload.toId}" }

            val targetSession = webSocketSessionCache.get(payload.toId)
            if (targetSession != null) {
                val response = VoiceOfferResponse(
                    payload = VoiceOfferResponse.Payload(
                        debateId = payload.debateId,
                        fromId = payload.fromId,
                        toId = payload.toId,
                        offer = payload.offer
                    )
                )
                val messageJson = objectMapper.writeValueAsString(response)
                sendTextMessage(targetSession, messageJson)
            } else {
                logger.warn { "Offer 전달 실패: 대상 세션을 찾을 수 없음 toId=${payload.toId}" }
            }
        } catch (e: Exception) {
            logger.error(e) { "Offer 전달 실패: from=${payload.fromId}, to=${payload.toId}" }
        }
    }

    /** WebRTC Answer를 특정 피어에게 전달합니다. */
    private fun handleVoiceAnswer(session: WebSocketSession, request: VoiceAnswerRequest) {
        val payload = request.payload ?: return
        val authenticatedAccountId = getAuthenticatedAccountId(session) ?: return
        if (!validateAccountIdMatch(authenticatedAccountId, payload.fromId)) {
            return
        }

        val sessionDebateId = session.attributes["debateId"] as? String
        if (sessionDebateId != payload.debateId) {
            logger.error { "Answer 요청 거부: 세션 방 불일치 sessionDebateId=$sessionDebateId, req=${payload.debateId}" }
            return
        }

        try {
            logger.debug { "Answer 전달: from=${payload.fromId}, to=${payload.toId}" }

            val targetSession = webSocketSessionCache.get(payload.toId)
            if (targetSession != null) {
                val response = VoiceAnswerResponse(
                    payload = VoiceAnswerResponse.Payload(
                        debateId = payload.debateId,
                        fromId = payload.fromId,
                        toId = payload.toId,
                        answer = payload.answer
                    )
                )
                val messageJson = objectMapper.writeValueAsString(response)
                sendTextMessage(targetSession, messageJson)
            } else {
                logger.warn { "Answer 전달 실패: 대상 세션을 찾을 수 없음 toId=${payload.toId}" }
            }
        } catch (e: Exception) {
            logger.error(e) { "Answer 전달 실패: from=${payload.fromId}, to=${payload.toId}" }
        }
    }

    /** Trickle ICE: ICE Candidate를 특정 피어에게 전달합니다. */
    private fun handleVoiceIceCandidate(session: WebSocketSession, request: VoiceIceCandidateRequest) {
        val payload = request.payload ?: return
        val authenticatedAccountId = getAuthenticatedAccountId(session) ?: return
        if (!validateAccountIdMatch(authenticatedAccountId, payload.fromId)) {
            return
        }

        val sessionDebateId = session.attributes["debateId"] as? String
        if (sessionDebateId != payload.debateId) {
            logger.error { "ICE Candidate 요청 거부: 세션 방 불일치 sessionDebateId=$sessionDebateId, req=${payload.debateId}" }
            return
        }

        try {
            logger.debug { "ICE Candidate 전달: from=${payload.fromId}, to=${payload.toId}" }

            val targetSession = webSocketSessionCache.get(payload.toId)
            if (targetSession != null) {
                val response = VoiceIceCandidateResponse(
                    payload = VoiceIceCandidateResponse.Payload(
                        debateId = payload.debateId,
                        fromId = payload.fromId,
                        toId = payload.toId,
                        candidate = payload.candidate
                    )
                )
                val messageJson = objectMapper.writeValueAsString(response)
                sendTextMessage(targetSession, messageJson)
            } else {
                logger.warn { "ICE Candidate 전달 실패: 대상 세션을 찾을 수 없음 toId=${payload.toId}" }
            }
        } catch (e: Exception) {
            logger.error(e) { "ICE Candidate 전달 실패: from=${payload.fromId}, to=${payload.toId}" }
        }
    }
}
package kr.co.booktalk.domain.debate

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import io.github.oshai.kotlinlogging.KotlinLogging
import jakarta.annotation.PreDestroy
import kotlinx.coroutines.*
import kr.co.booktalk.WebSocketMessage
import kr.co.booktalk.cache.DebateOnlineAccountsCache
import kr.co.booktalk.cache.HandRaiseCache
import kr.co.booktalk.cache.WebSocketSessionCache
import kr.co.booktalk.client.MonitorClient
import kr.co.booktalk.client.SendRequest
import kr.co.booktalk.coroutineGlobalExceptionHandler
import org.springframework.stereotype.Component
import org.springframework.web.socket.CloseStatus
import org.springframework.web.socket.TextMessage
import org.springframework.web.socket.WebSocketSession
import org.springframework.web.socket.handler.TextWebSocketHandler
import java.time.Instant

// TODO: 추 후 webSocket 모듈 제거. 도메인 단위로 모두 나누기
@Component
class DebateWebSocketHandler(
    private val debateOnlineAccountsCache: DebateOnlineAccountsCache,
    private val handRaiseCache: HandRaiseCache,
    private val webSocketSessionCache: WebSocketSessionCache,
    private val objectMapper: ObjectMapper,
    private val monitorClient: MonitorClient
) : TextWebSocketHandler() {
    private val logger = KotlinLogging.logger {}
    private val scope = CoroutineScope(SupervisorJob() + Dispatchers.IO + CoroutineName("api-websocket-handler")) + coroutineGlobalExceptionHandler

    @PreDestroy
    fun destroy() {
        scope.cancel()
    }

    override fun afterConnectionEstablished(session: WebSocketSession) {
        val accountId = session.attributes["accountId"] as? String
        if (accountId != null) {
            webSocketSessionCache.add(accountId, session)
        }
    }

    override fun afterConnectionClosed(session: WebSocketSession, status: CloseStatus) {
        val accountId = session.attributes["accountId"] as? String
        val debateId = session.attributes["debateId"] as? String

        if (accountId != null && debateId != null) {
            try {
                debateOnlineAccountsCache.remove(debateId, accountId)
                webSocketSessionCache.remove(accountId)
                broadcastDebateOnlineAccountsUpdate(debateId)
            } catch (e: Exception) {
                logger.error(e) { "연결 종료 시 정리 실패: accountId=$accountId, debateId=$debateId" }
            }
        }
    }

    override fun handleTextMessage(session: WebSocketSession, message: TextMessage) {
        try {
            val request = objectMapper.readValue<WebSocketMessage<*>>(message.payload)
            when (request.type) {
                WSRequestMessageType.C_JOIN_DEBATE.name -> {
                    handleJoinDebate(session, request as JoinDebateRequest)
                }

                WSRequestMessageType.C_LEAVE_DEBATE.name -> {
                    handleLeaveDebate(session, request as LeaveDebateRequest)
                }

                WSRequestMessageType.C_HEARTBEAT.name -> {
                    handleHeartbeat(session)
                }

                WSRequestMessageType.C_TOGGLE_HAND.name -> {
                    val toggleHandRequest = request as ToggleHandRequest
                    scope.launch {
                        try {
                            handleToggleHand(session, toggleHandRequest)
                        } catch (e: Exception) {
                            logger.error(e) { "손들기 처리 실패 - ${e.message}" }
                            monitorClient.send(
                                SendRequest(
                                    title = "[book-talk-api] INTERNAL SERVER ERROR",
                                    message = "${e.message}",
                                    stackTrace = e.stackTraceToString(),
                                    level = SendRequest.Level.ERROR
                                )
                            )
                        }
                    }
                }

                WSRequestMessageType.C_CHAT_MESSAGE.name -> {
                    handleChatMessage(session, request as ChatMessageRequest)
                }

                // WebRTC Signaling Messages (C_ = Client sends)
                WSRequestMessageType.C_VOICE_JOIN.name -> {
                    handleVoiceJoin(session, request as VoiceJoinRequest)
                }

                WSRequestMessageType.C_VOICE_OFFER.name -> {
                    handleVoiceOffer(session, request as VoiceOfferRequest)
                }

                WSRequestMessageType.C_VOICE_ANSWER.name -> {
                    handleVoiceAnswer(session, request as VoiceAnswerRequest)
                }

                WSRequestMessageType.C_VOICE_ICE_CANDIDATE.name -> {
                    handleVoiceIceCandidate(session, request as VoiceIceCandidateRequest)
                }
            }
        } catch (e: Exception) {
            logger.error(e) { "메시지 처리 실패: ${message.payload}" }
            scope.launch {
                monitorClient.send(
                    SendRequest(
                        title = "[book-talk-API] INTERNAL SERVER ERROR",
                        message = "${e.message}",
                        stackTrace = e.stackTraceToString(),
                        level = SendRequest.Level.ERROR
                    )
                )
            }
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
        joinDebateWithErrorHandling(session, payload.debateId, authenticatedAccountId)
    }

    /** 토론방 나가기 요청을 처리합니다. 사용자를 토론방에서 제거하고 세션을 정리합니다. */
    private fun handleLeaveDebate(session: WebSocketSession, request: LeaveDebateRequest) {
        val payload = request.payload ?: return
        val authenticatedAccountId = getAuthenticatedAccountId(session) ?: return
        leaveDebateAndCleanup(session, payload.debateId, authenticatedAccountId)
    }

    /** 클라이언트의 하트비트 요청을 처리하고 응답을 보냅니다. */
    private fun handleHeartbeat(session: WebSocketSession) {
        try {
            sendHeartbeatResponse(session)
        } catch (e: Exception) {
            logger.error(e) { "Heartbeat 처리 실패" }
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
    ) {
        try {
            debateOnlineAccountsCache.add(debateId, accountId)
            sendJoinSuccessResponse(session, debateId, accountId)

            broadcastDebateOnlineAccountsUpdate(debateId)
        } catch (e: Exception) {
            logger.error(e) { "토론 참여 처리 실패: debateId=$debateId, accountId=$accountId" }
        }
    }

    /** 토론 나가기 처리와 세션 정리를 수행합니다. */
    private fun leaveDebateAndCleanup(session: WebSocketSession, debateId: String, accountId: String) {
        try {
            debateOnlineAccountsCache.remove(debateId, accountId)
            broadcastDebateOnlineAccountsUpdate(debateId)
            session.attributes.remove("debateId")
        } catch (e: Exception) {
            logger.error(e) { "토론 나가기 처리 실패: debateId=$debateId, accountId=$accountId" }
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
    private fun broadcastDebateOnlineAccountsUpdate(debateId: String) {
        val onlineAccounts = debateOnlineAccountsCache.get(debateId)
        val response = DebateOnlineAccountsUpdateResponse(
            payload = DebateOnlineAccountsUpdateResponse.Payload(
                debateId = debateId,
                onlineAccounts = onlineAccounts
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
            val accountIds = debateOnlineAccountsCache.get(debateId)
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
            /** 손내리기 */
            handRaiseCache.remove(payload.debateId, authenticatedAccountId)
            publishHandRaiseUpdate(payload.debateId)
        } else {
            /** 손들기 */
            handRaiseCache.add(payload.debateId, authenticatedAccountId, Instant.now())
            publishHandRaiseUpdate(payload.debateId)

            delay(3000)
            handRaiseCache.remove(payload.debateId, authenticatedAccountId)
            publishHandRaiseUpdate(payload.debateId)
        }
    }

    /** 손들기 상태 업데이트를 토론방 모든 참가자에게 브로드캐스트합니다. */
    private fun publishHandRaiseUpdate(debateId: String) {
        val onlineAccountIds = debateOnlineAccountsCache.get(debateId)

        val raisedHandsList = onlineAccountIds.mapNotNull { accountId ->
            val raisedAt = handRaiseCache.get(debateId, accountId)
                ?: return@mapNotNull null

            HandRaiseUpdateResponse.Payload.RaisedHandInfo(
                accountId = accountId,
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
package kr.co.booktalk.domain.webSocket

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import io.github.oshai.kotlinlogging.KotlinLogging
import kotlinx.coroutines.*
import kr.co.booktalk.WebSocketMessage
import kr.co.booktalk.cache.DebateOnlineAccountsCache
import kr.co.booktalk.cache.WebSocketSessionCache
import kr.co.booktalk.domain.debate.DebateActivityService
import kr.co.booktalk.domain.debate.DebateChatService
import kr.co.booktalk.domain.debate.DebateService
import kr.co.booktalk.mqNetworkError
import org.springframework.stereotype.Component
import org.springframework.web.socket.CloseStatus
import org.springframework.web.socket.TextMessage
import org.springframework.web.socket.WebSocketSession
import org.springframework.web.socket.handler.TextWebSocketHandler

// TODO: 도메인 분리
// TODO: Network Error 상황에서 Ping Pong heartbeat 동작 확인 -> 구현이 필요한 부분이 정확하게 어디인지 파악하기
@Component
class WebSocketHandler(
    private val objectMapper: ObjectMapper,
    private val webSocketSessionCache: WebSocketSessionCache,
    private val debateOnlineAccountsCache: DebateOnlineAccountsCache,
    private val debateService: DebateService,
    private val debateActivityService: DebateActivityService,
    private val debateChatService: DebateChatService
) : TextWebSocketHandler() {
    private val logger = KotlinLogging.logger {}

    data class RaisedHandInfo(
        val accountId: String,
        val accountName: String,
        val raisedAt: Long
    )

    /** WebSocket 연결 수립 시 세션 등록 */
    override fun afterConnectionEstablished(session: WebSocketSession) {
        try {
            val accountId = session.attributes["accountId"]
            if (accountId is String) webSocketSessionCache.add(accountId, session)
        } catch (e: Exception) {
            logger.error(e) { "WebSocket 연결 실패: ${e.message}" }
        }
    }

    override fun handleTextMessage(session: WebSocketSession, message: TextMessage) {
        when (val type = objectMapper.readTree(message.payload).get("type").asText()) {
            WebSocketRequestEventType.JOIN_DEBATE.value -> {
                val request = objectMapper.readValue<JoinDebateRequest>(message.payload)
                debateService.joinSessionInDebate(request)
            }

            WebSocketRequestEventType.TOGGLE_HAND.value -> {
                val request = objectMapper.readValue<ToggleHandRaiseRequest>(message.payload)
                debateActivityService.toggleHandRaise(request)
            }

            WebSocketRequestEventType.CHAT.value -> {
                val request = objectMapper.readValue<ChatRequest>(message.payload)
                debateChatService.create(request)
            }
        }
    }
        //        when (payload.type) {
//            "C_CHAT_MESSAGE" -> {
//                val request = objectMapper.readValue<ChatMessageRequest>(message.payload)
//                handleChatMessage(session, request)
//            }
//
//            // WebRTC Signaling Messages (C_ = Client sends)
//            "C_VOICE_JOIN" -> {
//                val request = objectMapper.readValue<VoiceJoinRequest>(message.payload)
//                handleVoiceJoin(session, request)
//            }
//
//            "C_VOICE_OFFER" -> {
//                val request = objectMapper.readValue<VoiceOfferRequest>(message.payload)
//                handleVoiceOffer(session, request)
//            }
//
//            "C_VOICE_ANSWER" -> {
//                val request = objectMapper.readValue<VoiceAnswerRequest>(message.payload)
//                handleVoiceAnswer(session, request)
//            }
//
//            "C_VOICE_ICE_CANDIDATE" -> {
//                val request = objectMapper.readValue<VoiceIceCandidateRequest>(message.payload)
//                handleVoiceIceCandidate(session, request)
//            }
//
//            else -> logger.warn { "알 수 없는 메시지 타입: ${payload.type}" }
//        }
    }

    // TODO: 네트워크 에러 상황 모니터링 필요
    /** WebSocket 연결 종료 시 세션 정리 */
    override fun afterConnectionClosed(session: WebSocketSession, status: CloseStatus) {
        val debateId = session.attributes["debateId"]
        val accountId = session.attributes["accountId"]

        if (debateId is String && accountId is String) {
            debateOnlineAccountsCache.remove(debateId, accountId)
            webSocketSessionCache.remove(accountId)
        } else {
            logger.error { "WebSocket 연결 종료 실패: debateId=$debateId, accountId=$accountId" }
        }
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
        val response = JoinDebateResponse(debateId = debateId, accountId = accountId)
        sendMessage(session, response)
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
    private suspend fun handleToggleHand(session: WebSocketSession, request: ToggleHandRaiseRequest) {
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
            val handsKey = cacheProperties.handRaise.handsKey(request.debateId)
            val existing = cacheClient.hashGet(handsKey, authenticatedAccountId)

            if (existing != null) {
                // 손 내리기: Redis에서 삭제
                cacheClient.hashDelete(handsKey, authenticatedAccountId)
            } else {
                // 손들기: Redis에 저장
                val handInfo = RaisedHandInfo(
                    accountId = authenticatedAccountId,
                    accountName = request.accountName,
                    raisedAt = System.currentTimeMillis()
                )
                cacheClient.hashSet(handsKey, authenticatedAccountId, objectMapper.writeValueAsString(handInfo))
                cacheClient.expire(handsKey, cacheProperties.handRaise.handRaiseTtl)

                // 3초 후 자동으로 손 내리기
                delay(3000)
                cacheClient.hashDelete(handsKey, authenticatedAccountId)
                publishHandRaiseUpdate(request.debateId)
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
            // Redis에서 현재 손든 사용자 목록 조회
            val handsKey = cacheProperties.handRaise.handsKey(debateId)
            val handsMap = cacheClient.hashGetAll(handsKey)

            val raisedHandsList = handsMap.values.mapNotNull { json ->
                try {
                    val handInfo = objectMapper.readValue<RaisedHandInfo>(json)
                    HandRaiseResponse.RaisedHandInfo(
                        accountId = handInfo.accountId,
                        accountName = handInfo.accountName,
                        raisedAt = handInfo.raisedAt
                    )
                } catch (e: Exception) {
                    logger.warn(e) { "손들기 정보 파싱 실패: $json" }
                    null
                }
            }

            val response = HandRaiseResponse(
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
    private fun handleChatMessage(session: WebSocketSession, request: ChatRequest) {
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
        val response = ChatMessageResponse(
            debateId = debateId,
            chatId = chatId
        )

        val messageJson = objectMapper.writeValueAsString(response)
        broadcastToDebateRoom(debateId, messageJson)

        logger.debug { "채팅 메시지 브로드캐스트 완료: debateId=$debateId, chatId=$chatId" }
    }

    // ============ WebRTC Signaling Handlers ============

    /** 음성 채팅 참여 요청을 처리합니다. */
    private fun handleVoiceJoin(session: WebSocketSession, request: VoiceJoinRequest) {
        val authenticatedAccountId = getAuthenticatedAccountId(session) ?: return
        if (!validateAccountIdMatch(authenticatedAccountId, request.accountId)) {
            return
        }

        val sessionDebateId = session.attributes["debateId"] as? String
        if (sessionDebateId != request.debateId) {
            logger.error { "음성 참여 요청 거부: 세션 방 불일치 sessionDebateId=$sessionDebateId, req=${request.debateId}" }
            return
        }

        try {
            logger.info { "음성 채팅 참여: debateId=${request.debateId}, accountId=${request.accountId}" }

            // 같은 토론방의 다른 참가자들에게 S_VOICE_JOIN 브로드캐스트
            val broadcastMessage = mapOf(
                "type" to "S_VOICE_JOIN",
                "provider" to "API",
                "debateId" to request.debateId,
                "fromId" to request.accountId
            )
            val messageJson = objectMapper.writeValueAsString(broadcastMessage)
            broadcastToDebateRoom(request.debateId, messageJson)
        } catch (e: Exception) {
            logger.error(e) { "음성 참여 처리 실패: debateId=${request.debateId}, accountId=${request.accountId}" }
        }
    }

    /** WebRTC Offer를 특정 피어에게 전달합니다. */
    private fun handleVoiceOffer(session: WebSocketSession, request: VoiceOfferRequest) {
        val authenticatedAccountId = getAuthenticatedAccountId(session) ?: return
        if (!validateAccountIdMatch(authenticatedAccountId, request.fromId)) {
            return
        }

        val sessionDebateId = session.attributes["debateId"] as? String
        if (sessionDebateId != request.debateId) {
            logger.error { "Offer 요청 거부: 세션 방 불일치 sessionDebateId=$sessionDebateId, req=${request.debateId}" }
            return
        }

        try {
            logger.debug { "Offer 전달: from=${request.fromId}, to=${request.toId}" }

            // toId에 해당하는 세션에만 전달
            val targetSession = localSessions.values.find { targetSession ->
                targetSession.attributes["accountId"] == request.toId &&
                        targetSession.attributes["debateId"] == request.debateId
            }

            if (targetSession != null) {
                val relayedMessage = mapOf(
                    "type" to "S_VOICE_OFFER",
                    "provider" to "API",
                    "debateId" to request.debateId,
                    "fromId" to request.fromId,
                    "toId" to request.toId,
                    "offer" to request.offer
                )
                val messageJson = objectMapper.writeValueAsString(relayedMessage)
                sendTextMessage(targetSession, messageJson)
            } else {
                logger.warn { "Offer 전달 실패: 대상 세션을 찾을 수 없음 toId=${request.toId}" }
            }
        } catch (e: Exception) {
            logger.error(e) { "Offer 전달 실패: from=${request.fromId}, to=${request.toId}" }
        }
    }

    /** WebRTC Answer를 특정 피어에게 전달합니다. */
    private fun handleVoiceAnswer(session: WebSocketSession, request: VoiceAnswerRequest) {
        val authenticatedAccountId = getAuthenticatedAccountId(session) ?: return
        if (!validateAccountIdMatch(authenticatedAccountId, request.fromId)) {
            return
        }

        val sessionDebateId = session.attributes["debateId"] as? String
        if (sessionDebateId != request.debateId) {
            logger.error { "Answer 요청 거부: 세션 방 불일치 sessionDebateId=$sessionDebateId, req=${request.debateId}" }
            return
        }

        try {
            logger.debug { "Answer 전달: from=${request.fromId}, to=${request.toId}" }

            // toId에 해당하는 세션에만 전달
            val targetSession = localSessions.values.find { targetSession ->
                targetSession.attributes["accountId"] == request.toId &&
                        targetSession.attributes["debateId"] == request.debateId
            }

            if (targetSession != null) {
                val relayedMessage = mapOf(
                    "type" to "S_VOICE_ANSWER",
                    "provider" to "API",
                    "debateId" to request.debateId,
                    "fromId" to request.fromId,
                    "toId" to request.toId,
                    "answer" to request.answer
                )
                val messageJson = objectMapper.writeValueAsString(relayedMessage)
                sendTextMessage(targetSession, messageJson)
            } else {
                logger.warn { "Answer 전달 실패: 대상 세션을 찾을 수 없음 toId=${request.toId}" }
            }
        } catch (e: Exception) {
            logger.error(e) { "Answer 전달 실패: from=${request.fromId}, to=${request.toId}" }
        }
    }

    /** Trickle ICE: ICE Candidate를 특정 피어에게 전달합니다. */
    private fun handleVoiceIceCandidate(session: WebSocketSession, request: VoiceIceCandidateRequest) {
        val authenticatedAccountId = getAuthenticatedAccountId(session) ?: return
        if (!validateAccountIdMatch(authenticatedAccountId, request.fromId)) {
            return
        }

        val sessionDebateId = session.attributes["debateId"] as? String
        if (sessionDebateId != request.debateId) {
            logger.error { "ICE Candidate 요청 거부: 세션 방 불일치 sessionDebateId=$sessionDebateId, req=${request.debateId}" }
            return
        }

        try {
            logger.debug { "ICE Candidate 전달: from=${request.fromId}, to=${request.toId}" }

            // toId에 해당하는 세션에만 전달
            val targetSession = localSessions.values.find { targetSession ->
                targetSession.attributes["accountId"] == request.toId &&
                        targetSession.attributes["debateId"] == request.debateId
            }

            if (targetSession != null) {
                val relayedMessage = mapOf(
                    "type" to "S_VOICE_ICE_CANDIDATE",
                    "provider" to "API",
                    "debateId" to request.debateId,
                    "fromId" to request.fromId,
                    "toId" to request.toId,
                    "candidate" to request.candidate
                )
                val messageJson = objectMapper.writeValueAsString(relayedMessage)
                sendTextMessage(targetSession, messageJson)
            } else {
                logger.warn { "ICE Candidate 전달 실패: 대상 세션을 찾을 수 없음 toId=${request.toId}" }
            }
        } catch (e: Exception) {
            logger.error(e) { "ICE Candidate 전달 실패: from=${request.fromId}, to=${request.toId}" }
        }
    }
}

/** websocket session 메시지 전송 */
fun WebSocketSession.sendByMQ(textMessage: String) {
    try {
        if (this.isOpen) {
            synchronized(this) {
                this.sendMessage(TextMessage(textMessage))
            }
        }
    } catch (e: Exception) {
        mqNetworkError(e)
    }
}
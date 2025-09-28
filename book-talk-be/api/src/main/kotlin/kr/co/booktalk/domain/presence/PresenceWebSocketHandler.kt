package kr.co.booktalk.domain.presence

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import io.github.oshai.kotlinlogging.KotlinLogging
import kr.co.booktalk.cache.CacheClient
import org.springframework.data.redis.core.RedisTemplate
import org.springframework.stereotype.Component
import org.springframework.web.socket.CloseStatus
import org.springframework.web.socket.TextMessage
import org.springframework.web.socket.WebSocketSession
import org.springframework.web.socket.handler.TextWebSocketHandler
import java.time.Duration
import java.util.concurrent.ConcurrentHashMap

@Component
class PresenceWebSocketHandler(
    private val presenceService: PresenceService,
    private val objectMapper: ObjectMapper,
    private val cacheClient: CacheClient,
    private val redisTemplate: RedisTemplate<String, String>
) : TextWebSocketHandler() {

    private val logger = KotlinLogging.logger {}

    // 로컬 세션은 WebSocketSession 객체 관리용으로만 사용
    private val localSessions = ConcurrentHashMap<String, WebSocketSession>()

    // Redis 키 패턴
    companion object {
        const val SESSION_ACCOUNT_KEY = "ws:session:account:"
        const val SESSION_DEBATE_KEY = "ws:session:debate:"
        const val ACCOUNT_SESSION_KEY = "ws:account:session:"
        const val DEBATE_SESSIONS_KEY = "ws:debate:sessions:"
        const val DEBATE_RAISED_HANDS_KEY = "ws:debate:raised_hands:"
        const val SESSION_TTL_SECONDS = 3600L // 1시간
    }

    /** WebSocket 연결 수립 시 세션을 등록하고 로그를 기록합니다. */
    override fun afterConnectionEstablished(session: WebSocketSession) {
        localSessions[session.id] = session
        val accountId = getAuthenticatedAccountId(session)

        // Redis에 세션 정보 저장
        accountId?.let {
            cacheClient.set(
                "$SESSION_ACCOUNT_KEY${session.id}",
                it,
                Duration.ofSeconds(SESSION_TTL_SECONDS)
            )
            cacheClient.set(
                "$ACCOUNT_SESSION_KEY$it",
                session.id,
                Duration.ofSeconds(SESSION_TTL_SECONDS)
            )
        }

        logger.info { "WebSocket 연결 성공: sessionId=${session.id}, accountId=$accountId" }
    }

    /** 클라이언트로부터 수신된 텍스트 메시지를 파싱하고 타입별로 처리합니다. */
    override fun handleTextMessage(session: WebSocketSession, message: TextMessage) {
        try {
            val payload = objectMapper.readTree(message.payload)
            val messageType = payload.get("type")?.asText()

            logger.debug { "수신된 메시지: type=$messageType, sessionId=${session.id}" }

            when (messageType) {
                "JOIN_DEBATE" -> handleJoinDebate(session, payload)
                "LEAVE_DEBATE" -> handleLeaveDebate(session, payload)
                "HEARTBEAT" -> handleHeartbeat(session, payload)
                "TOGGLE_HAND" -> handleToggleHand(session, payload)
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
    private fun handleJoinDebate(session: WebSocketSession, payload: JsonNode) {
        val debateId = extractDebateId(payload) ?: return
        val authenticatedAccountId = getAuthenticatedAccountId(session) ?: return
        val accountName = payload.get("accountName")?.asText() ?: "Unknown Account"

        if (!validateAccountIdMatch(authenticatedAccountId, payload)) {
            return
        }

        registerAccountSession(session, authenticatedAccountId, debateId)
        joinDebateWithErrorHandling(session, debateId, authenticatedAccountId, accountName)
    }

    /** 토론방 나가기 요청을 처리합니다. 사용자를 토론방에서 제거하고 세션을 정리합니다. */
    private fun handleLeaveDebate(session: WebSocketSession, payload: JsonNode) {
        val debateId = extractDebateId(payload) ?: return
        val authenticatedAccountId = getAuthenticatedAccountId(session) ?: return

        leaveDebateAndCleanup(session, debateId, authenticatedAccountId)
    }

    /** 클라이언트의 하트비트 요청을 처리하고 응답을 보냅니다. */
    private fun handleHeartbeat(session: WebSocketSession, @Suppress("UNUSED_PARAMETER") payload: JsonNode) {
        val authenticatedAccountId = getAuthenticatedAccountId(session) ?: return

        try {
            presenceService.updateHeartbeat(authenticatedAccountId)
            sendHeartbeatResponse(session)

            // 세션 TTL 갱신
            refreshSessionTTL(session, authenticatedAccountId)
        } catch (e: Exception) {
            logger.error(e) { "Heartbeat 처리 실패: accountId=$authenticatedAccountId" }
        }
    }

    /** 세션에서 인증된 계정 ID를 추출합니다. */
    private fun getAuthenticatedAccountId(session: WebSocketSession): String? {
        // 먼저 세션 속성에서 확인 (HandshakeInterceptor에서 설정)
        val attrAccountId = session.attributes["accountId"] as? String
        if (attrAccountId != null) return attrAccountId

        // Redis에서 확인 (재연결된 경우)
        return cacheClient.get("$SESSION_ACCOUNT_KEY${session.id}")
    }

    /** 메시지 페이로드에서 토론방 ID를 추출합니다. */
    private fun extractDebateId(payload: JsonNode): String? {
        return payload.get("debateId")?.asText()
    }

    /** 요청된 계정 ID와 인증된 계정 ID가 일치하는지 검증합니다. */
    private fun validateAccountIdMatch(authenticatedAccountId: String, payload: JsonNode): Boolean {
        val requestedAccountId = payload.get("accountId")?.asText()
        return if (requestedAccountId != null && requestedAccountId != authenticatedAccountId) {
            logger.warn { "계정 ID 불일치: authenticated=$authenticatedAccountId, requested=$requestedAccountId" }
            false
        } else {
            true
        }
    }

    /** 세션에 계정과 토론방 정보를 Redis에 등록합니다. */
    private fun registerAccountSession(session: WebSocketSession, accountId: String, debateId: String) {
        // Redis에 세션 매핑 정보 저장
        cacheClient.set(
            "$SESSION_ACCOUNT_KEY${session.id}",
            accountId,
            Duration.ofSeconds(SESSION_TTL_SECONDS)
        )
        cacheClient.set(
            "$SESSION_DEBATE_KEY${session.id}",
            debateId,
            Duration.ofSeconds(SESSION_TTL_SECONDS)
        )

        // 토론방별 세션 목록 관리 (Set 자료구조 사용)
        redisTemplate.opsForSet().add("$DEBATE_SESSIONS_KEY$debateId", session.id)
        redisTemplate.expire("$DEBATE_SESSIONS_KEY$debateId", Duration.ofSeconds(SESSION_TTL_SECONDS))

        // 계정별 현재 세션 정보 저장
        cacheClient.set(
            "$ACCOUNT_SESSION_KEY$accountId",
            session.id,
            Duration.ofSeconds(SESSION_TTL_SECONDS)
        )
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

    /** Redis에서 세션 정보를 제거합니다. */
    private fun removeAccountSession(session: WebSocketSession) {
        val accountId = cacheClient.get("$SESSION_ACCOUNT_KEY${session.id}")
        val debateId = cacheClient.get("$SESSION_DEBATE_KEY${session.id}")

        // Redis에서 세션 정보 삭제
        cacheClient.delete("$SESSION_ACCOUNT_KEY${session.id}")
        cacheClient.delete("$SESSION_DEBATE_KEY${session.id}")

        // 토론방 세션 목록에서 제거
        debateId?.let {
            redisTemplate.opsForSet().remove("$DEBATE_SESSIONS_KEY$it", session.id)
        }

        // 계정 세션 정보 삭제
        accountId?.let {
            cacheClient.delete("$ACCOUNT_SESSION_KEY$it")
        }
    }

    /** 연결 종료 시 세션과 관련된 모든 정보를 정리합니다. */
    private fun cleanupSession(session: WebSocketSession, status: CloseStatus) {
        val accountId = cacheClient.get("$SESSION_ACCOUNT_KEY${session.id}")
        val debateId = cacheClient.get("$SESSION_DEBATE_KEY${session.id}")

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

        logger.info { "WebSocket 연결 종료: sessionId=${session.id}, accountId=$accountId, status=${status.code}" }
    }

    /** 토론 참여 성공 응답을 클라이언트에게 전송합니다. */
    private fun sendJoinSuccessResponse(session: WebSocketSession, debateId: String, accountId: String) {
        sendMessage(
            session, mapOf(
                "type" to "JOIN_SUCCESS",
                "debateId" to debateId,
                "accountId" to accountId
            )
        )
    }

    /** 토론 참여 실패 응답을 클라이언트에게 전송합니다. */
    private fun sendJoinErrorResponse(session: WebSocketSession, debateId: String, accountId: String, reason: String) {
        sendMessage(
            session, mapOf(
                "type" to "JOIN_ERROR",
                "debateId" to debateId,
                "accountId" to accountId,
                "reason" to reason
            )
        )
    }

    /** 하트비트 응답을 클라이언트에게 전송합니다. */
    private fun sendHeartbeatResponse(session: WebSocketSession) {
        sendMessage(
            session, mapOf(
                "type" to "HEARTBEAT_ACK",
                "timestamp" to System.currentTimeMillis()
            )
        )
    }

    /** 세션의 TTL을 갱신합니다. */
    private fun refreshSessionTTL(session: WebSocketSession, accountId: String) {
        val debateId = cacheClient.get("$SESSION_DEBATE_KEY${session.id}") ?: return

        // 모든 세션 관련 키의 TTL 갱신
        redisTemplate.expire("$SESSION_ACCOUNT_KEY${session.id}", Duration.ofSeconds(SESSION_TTL_SECONDS))
        redisTemplate.expire("$SESSION_DEBATE_KEY${session.id}", Duration.ofSeconds(SESSION_TTL_SECONDS))
        redisTemplate.expire("$ACCOUNT_SESSION_KEY$accountId", Duration.ofSeconds(SESSION_TTL_SECONDS))
        redisTemplate.expire("$DEBATE_SESSIONS_KEY$debateId", Duration.ofSeconds(SESSION_TTL_SECONDS))
    }

    /** 해당 토론방의 모든 WebSocket 세션에 presence 업데이트를 직접 브로드캐스트합니다. */
    private fun publishPresenceUpdate(debateId: String) {
        val onlineAccounts = presenceService.getOnlineAccounts(debateId)
        val message = mapOf(
            "type" to "PRESENCE_UPDATE",
            "debateId" to debateId,
            "onlineAccounts" to onlineAccounts.map { account ->
                mapOf(
                    "accountId" to account.accountId,
                    "accountName" to account.accountName,
                    "status" to account.status.name,
                    "lastHeartbeat" to account.lastHeartbeat.toEpochMilli()
                )
            }
        )

        // 해당 토론방의 모든 WebSocket 세션에 직접 브로드캐스트
        val messageJson = objectMapper.writeValueAsString(message)
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
            val message = objectMapper.readTree(messageJson)

            // Redis에서 해당 토론방의 세션 목록 조회
            val sessionIds = redisTemplate.opsForSet().members("$DEBATE_SESSIONS_KEY$debateId") ?: emptySet()

            // 로컬에 있는 세션에만 메시지 전송
            sessionIds.forEach { sessionId ->
                localSessions[sessionId]?.let { session ->
                    sendMessage(session, message)
                }
            }

            logger.debug { "토론방 브로드캐스트 완료: debateId=$debateId, sessions=${sessionIds.size}" }
        } catch (e: Exception) {
            logger.error(e) { "토론방 브로드캐스트 실패: debateId=$debateId, messageJson=$messageJson" }
        }
    }

    /** 손들기 토글 요청을 처리합니다. */
    private fun handleToggleHand(session: WebSocketSession, payload: JsonNode) {
        val debateId = extractDebateId(payload) ?: return
        val authenticatedAccountId = getAuthenticatedAccountId(session) ?: return
        val accountName = payload.get("accountName")?.asText() ?: "Unknown Account"

        if (!validateAccountIdMatch(authenticatedAccountId, payload)) {
            return
        }

        try {
            val handKey = "$DEBATE_RAISED_HANDS_KEY$debateId:$authenticatedAccountId"
            val isHandRaised = redisTemplate.hasKey(handKey)

            if (isHandRaised) {
                // 손 내리기: Redis에서 삭제
                redisTemplate.delete(handKey)
                logger.info { "손내리기 처리 완료: debateId=$debateId, accountId=$authenticatedAccountId" }
            } else {
                // 손들기: Redis에 저장
                val handRaisedData = mapOf(
                    "accountId" to authenticatedAccountId,
                    "accountName" to accountName,
                    "raisedAt" to System.currentTimeMillis().toString()
                )

                redisTemplate.opsForHash<String, String>().putAll(handKey, handRaisedData)
                redisTemplate.expire(handKey, Duration.ofSeconds(SESSION_TTL_SECONDS))
                logger.info { "손들기 처리 완료: debateId=$debateId, accountId=$authenticatedAccountId" }
            }

            // 손들기 상태 브로드캐스트
            publishHandRaiseUpdate(debateId)

        } catch (e: Exception) {
            logger.error(e) { "손들기 토글 처리 실패: debateId=$debateId, accountId=$authenticatedAccountId" }
        }
    }

    /** 손들기 상태 업데이트를 토론방 모든 참가자에게 브로드캐스트합니다. */
    private fun publishHandRaiseUpdate(debateId: String) {
        try {
            // Redis에서 현재 손든 사용자 목록 조회
            val raisedHandsPattern = "$DEBATE_RAISED_HANDS_KEY$debateId:*"
            val raisedHandKeys = redisTemplate.keys(raisedHandsPattern)

            val raisedHands = raisedHandKeys.map { key ->
                val handData = redisTemplate.opsForHash<String, String>().entries(key)
                mapOf(
                    "accountId" to handData["accountId"],
                    "accountName" to handData["accountName"],
                    "raisedAt" to handData["raisedAt"]?.toLongOrNull()
                )
            }.filterNotNull()

            val message = mapOf(
                "type" to "HAND_RAISE_UPDATE",
                "debateId" to debateId,
                "raisedHands" to raisedHands
            )

            val messageJson = objectMapper.writeValueAsString(message)
            broadcastToDebateRoom(debateId, messageJson)

            logger.debug { "손들기 상태 브로드캐스트 완료: debateId=$debateId, raisedHands=${raisedHands.size}" }
        } catch (e: Exception) {
            logger.error(e) { "손들기 상태 브로드캐스트 실패: debateId=$debateId" }
        }
    }

}
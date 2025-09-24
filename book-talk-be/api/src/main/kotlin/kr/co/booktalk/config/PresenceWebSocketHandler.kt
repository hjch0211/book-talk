package kr.co.booktalk.config

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import io.github.oshai.kotlinlogging.KotlinLogging
import kr.co.booktalk.presence.PresenceService
import org.springframework.stereotype.Component
import org.springframework.web.socket.CloseStatus
import org.springframework.web.socket.TextMessage
import org.springframework.web.socket.WebSocketSession
import org.springframework.web.socket.handler.TextWebSocketHandler
import java.util.concurrent.ConcurrentHashMap

@Component
class PresenceWebSocketHandler(
    private val presenceService: PresenceService,
    private val objectMapper: ObjectMapper
) : TextWebSocketHandler() {

    private val logger = KotlinLogging.logger {}
    private val sessions = ConcurrentHashMap<String, WebSocketSession>()
    private val sessionToUser = ConcurrentHashMap<String, String>()
    private val sessionToDebate = ConcurrentHashMap<String, String>()

    /** WebSocket 연결 수립 시 세션을 등록하고 로그를 기록합니다. */
    override fun afterConnectionEstablished(session: WebSocketSession) {
        sessions[session.id] = session
        val userId = getAuthenticatedUserId(session)
        logger.info { "WebSocket 연결 성공: sessionId=${session.id}, userId=$userId" }
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
                else -> logger.warn { "알 수 없는 메시지 타입: $messageType" }
            }
        } catch (e: Exception) {
            logger.error(e) { "메시지 처리 실패: ${message.payload}" }
        }
    }

    /** WebSocket 연결 종료 시 세션을 정리합니다. */
    override fun afterConnectionClosed(session: WebSocketSession, status: CloseStatus) {
        cleanupSession(session, status)
    }

    /** 토론방 참여 요청을 처리합니다. 사용자 인증, 유효성 검사를 거쳐 토론방에 참여시킵니다. */
    private fun handleJoinDebate(session: WebSocketSession, payload: JsonNode) {
        val debateId = extractDebateId(payload) ?: return
        val authenticatedUserId = getAuthenticatedUserId(session) ?: return
        val userName = payload.get("userName")?.asText() ?: "Unknown User"

        if (!validateUserIdMatch(authenticatedUserId, payload)) {
            return
        }

        registerUserSession(session, authenticatedUserId, debateId)
        joinDebateWithErrorHandling(session, debateId, authenticatedUserId, userName)
    }

    /** 토론방 나가기 요청을 처리합니다. 사용자를 토론방에서 제거하고 세션을 정리합니다. */
    private fun handleLeaveDebate(session: WebSocketSession, payload: JsonNode) {
        val debateId = extractDebateId(payload) ?: return
        val authenticatedUserId = getAuthenticatedUserId(session) ?: return

        leaveDebateAndCleanup(session, debateId, authenticatedUserId)
    }

    /** 클라이언트의 하트비트 요청을 처리하고 응답을 보냅니다. */
    private fun handleHeartbeat(session: WebSocketSession, @Suppress("UNUSED_PARAMETER") payload: JsonNode) {
        val authenticatedUserId = getAuthenticatedUserId(session) ?: return

        try {
            presenceService.updateHeartbeat(authenticatedUserId)
            sendHeartbeatResponse(session)
        } catch (e: Exception) {
            logger.error(e) { "Heartbeat 처리 실패: userId=$authenticatedUserId" }
        }
    }

    /** 세션에서 인증된 사용자 ID를 추출합니다. */
    private fun getAuthenticatedUserId(session: WebSocketSession): String? {
        return session.attributes["userId"] as? String
    }

    /** 메시지 페이로드에서 토론방 ID를 추출합니다. */
    private fun extractDebateId(payload: JsonNode): String? {
        return payload.get("debateId")?.asText()
    }

    /** 요청된 사용자 ID와 인증된 사용자 ID가 일치하는지 검증합니다. */
    private fun validateUserIdMatch(authenticatedUserId: String, payload: JsonNode): Boolean {
        val requestedUserId = payload.get("userId")?.asText()
        return if (requestedUserId != null && requestedUserId != authenticatedUserId) {
            logger.warn { "사용자 ID 불일치: authenticated=$authenticatedUserId, requested=$requestedUserId" }
            false
        } else {
            true
        }
    }

    /** 세션에 사용자와 토론방 정보를 등록합니다. */
    private fun registerUserSession(session: WebSocketSession, userId: String, debateId: String) {
        sessionToUser[session.id] = userId
        sessionToDebate[session.id] = debateId
    }

    /** 토론 참여 처리를 에러 핸들링과 함께 수행합니다. */
    private fun joinDebateWithErrorHandling(
        session: WebSocketSession,
        debateId: String,
        userId: String,
        userName: String
    ) {
        try {
            presenceService.joinDebate(debateId, userId, userName)
            sendJoinSuccessResponse(session, debateId, userId)

            // 약간의 지연 후 presence 업데이트 브로드캐스트
            Thread.sleep(100)
            broadcastPresenceUpdate(debateId)

        } catch (e: Exception) {
            logger.error(e) { "토론 참여 처리 실패: debateId=$debateId, userId=$userId" }
            sendJoinSuccessResponse(session, debateId, userId) // 실패 시에도 기본 응답
        }
    }

    /** 토론 나가기 처리와 세션 정리를 수행합니다. */
    private fun leaveDebateAndCleanup(session: WebSocketSession, debateId: String, userId: String) {
        try {
            presenceService.leaveDebate(debateId, userId)
            broadcastPresenceUpdate(debateId)
            removeUserSession(session)
        } catch (e: Exception) {
            logger.error(e) { "토론 나가기 처리 실패: debateId=$debateId, userId=$userId" }
        }
    }

    /** 세션에서 사용자 정보를 제거합니다. */
    private fun removeUserSession(session: WebSocketSession) {
        sessionToUser.remove(session.id)
        sessionToDebate.remove(session.id)
    }

    /** 연결 종료 시 세션과 관련된 모든 정보를 정리합니다. */
    private fun cleanupSession(session: WebSocketSession, status: CloseStatus) {
        val userId = sessionToUser.remove(session.id)
        val debateId = sessionToDebate.remove(session.id)
        sessions.remove(session.id)

        if (userId != null && debateId != null) {
            try {
                presenceService.leaveDebate(debateId, userId)
                broadcastPresenceUpdate(debateId)
            } catch (e: Exception) {
                logger.error(e) { "연결 종료 시 정리 실패: userId=$userId, debateId=$debateId" }
            }
        }

        logger.info { "WebSocket 연결 종료: sessionId=${session.id}, userId=$userId, status=${status.code}" }
    }

    /** 토론 참여 성공 응답을 클라이언트에게 전송합니다. */
    private fun sendJoinSuccessResponse(session: WebSocketSession, debateId: String, userId: String) {
        sendMessage(
            session, mapOf(
                "type" to "JOIN_SUCCESS",
                "debateId" to debateId,
                "userId" to userId
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

    /** 토론방의 온라인 사용자 정보를 해당 토론방의 모든 클라이언트에게 브로드캐스트합니다. */
    private fun broadcastPresenceUpdate(debateId: String) {
        val onlineUsers = presenceService.getOnlineUsers(debateId)
        val message = mapOf(
            "type" to "PRESENCE_UPDATE",
            "debateId" to debateId,
            "onlineUsers" to onlineUsers.map { user ->
                mapOf(
                    "userId" to user.userId,
                    "userName" to user.userName,
                    "status" to user.status.name,
                    "lastHeartbeat" to user.lastHeartbeat.toEpochMilli()
                )
            }
        )

        // 같은 토론방의 모든 세션에 브로드캐스트
        sessionToDebate.entries
            .filter { it.value == debateId }
            .mapNotNull { sessions[it.key] }
            .forEach { session ->
                sendMessage(session, message)
            }
    }

    /** WebSocket 세션을 통해 클라이언트에게 메시지를 전송합니다. */
    private fun sendMessage(session: WebSocketSession, message: Any) {
        try {
            if (session.isOpen) {
                val messageJson = objectMapper.writeValueAsString(message)
                session.sendMessage(TextMessage(messageJson))
            }
        } catch (e: Exception) {
            logger.error(e) { "메시지 전송 실패: sessionId=${session.id}" }
        }
    }
}
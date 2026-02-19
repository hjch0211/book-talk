package kr.co.booktalk.domain.aiChat

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import io.github.oshai.kotlinlogging.KotlinLogging
import kr.co.booktalk.cache.WebSocketSessionCache
import org.springframework.stereotype.Component
import org.springframework.web.socket.CloseStatus
import org.springframework.web.socket.TextMessage
import org.springframework.web.socket.WebSocketSession
import org.springframework.web.socket.handler.TextWebSocketHandler

@Component
class AiChatWebSocketHandler(
    private val webSocketSessionCache: WebSocketSessionCache,
    private val objectMapper: ObjectMapper,
    private val aiChatService: AiChatService,
) : TextWebSocketHandler() {
    private val logger = KotlinLogging.logger {}

    override fun afterConnectionEstablished(session: WebSocketSession) {
        val accountId = session.attributes["accountId"] as? String
        if (accountId != null) {
            webSocketSessionCache.add(accountId, session)
        }
    }

    override fun afterConnectionClosed(session: WebSocketSession, status: CloseStatus) {
        val accountId = session.attributes["accountId"] as? String ?: return
        webSocketSessionCache.remove(accountId)
    }

    override fun handleTextMessage(session: WebSocketSession, message: TextMessage) {
        try {
            val raw = objectMapper.readValue<Map<String, Any?>>(message.payload)
            val type = raw["type"] as? String ?: return

            when (type) {
                WSAiChatRequestMessageType.C_HEARTBEAT.name -> {
                    handleHeartbeat(session)
                }

                WSAiChatRequestMessageType.C_AI_CHAT.name -> {
                    handleAiChat(session, objectMapper.convertValue(raw, AiChatWsRequest::class.java))
                }
            }
        } catch (e: Exception) {
            logger.error(e) { "AI 채팅 메시지 처리 실패: ${message.payload}" }
        }
    }

    private fun handleHeartbeat(session: WebSocketSession) {
        try {
            val response = mapOf("type" to "S_HEARTBEAT_ACK", "payload" to mapOf("timestamp" to System.currentTimeMillis()))
            val messageJson = objectMapper.writeValueAsString(response)
            synchronized(session) {
                if (session.isOpen) {
                    session.sendMessage(TextMessage(messageJson))
                }
            }
        } catch (e: Exception) {
            logger.error(e) { "Heartbeat 처리 실패" }
        }
    }

    private fun handleAiChat(session: WebSocketSession, request: AiChatWsRequest) {
        val payload = request.payload

        try {
            aiChatService.chat(AiChatRequest(chatId = payload.chatId, message = payload.message))
        } catch (e: Exception) {
            logger.error(e) { "AI 채팅 처리 실패: chatId=${payload.chatId}" }
        }
    }
}

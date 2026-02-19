package kr.co.booktalk.config

import kr.co.booktalk.WebSocketJwtHandshakeInterceptor
import kr.co.booktalk.domain.aiChat.AiChatWebSocketHandler
import kr.co.booktalk.domain.debate.DebateWebSocketHandler
import org.springframework.context.annotation.Configuration
import org.springframework.web.socket.config.annotation.EnableWebSocket
import org.springframework.web.socket.config.annotation.WebSocketConfigurer
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry

@Configuration
@EnableWebSocket
class WebSocketConfig(
    private val debateWebSocketHandler: DebateWebSocketHandler,
    private val aiChatWebSocketHandler: AiChatWebSocketHandler,
    private val webSocketJwtHandshakeInterceptor: WebSocketJwtHandshakeInterceptor,
    private val appProperties: AppProperties
) : WebSocketConfigurer {

    override fun registerWebSocketHandlers(registry: WebSocketHandlerRegistry) {
        val allowedOrigins = appProperties.cors.allowedOrigins.toTypedArray()

        // TODO: 추 후 Socket.io 도입 후 multiplexing 필요
        registry.addHandler(debateWebSocketHandler, "/ws")
            .addInterceptors(webSocketJwtHandshakeInterceptor)
            .setAllowedOriginPatterns(*allowedOrigins)

        registry.addHandler(aiChatWebSocketHandler, "/ws/ai-chat")
            .addInterceptors(webSocketJwtHandshakeInterceptor)
            .setAllowedOriginPatterns(*allowedOrigins)
    }
}
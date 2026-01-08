package kr.co.booktalk.config

import kr.co.booktalk.domain.webSocket.WebSocketHandler
import kr.co.booktalk.domain.webSocket.WebSocketJwtHandshakeInterceptor
import org.springframework.context.annotation.Configuration
import org.springframework.web.socket.config.annotation.EnableWebSocket
import org.springframework.web.socket.config.annotation.WebSocketConfigurer
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry

@Configuration
@EnableWebSocket
class WebSocketConfig(
    private val webSocketHandler: WebSocketHandler,
    private val webSocketJwtHandshakeInterceptor: WebSocketJwtHandshakeInterceptor,
    private val appProperties: AppProperties
) : WebSocketConfigurer {
    override fun registerWebSocketHandlers(registry: WebSocketHandlerRegistry) {
        registry.addHandler(webSocketHandler, "/ws")
            .addInterceptors(webSocketJwtHandshakeInterceptor)
            .setAllowedOriginPatterns(*appProperties.cors.allowedOrigins.toTypedArray())
    }
}
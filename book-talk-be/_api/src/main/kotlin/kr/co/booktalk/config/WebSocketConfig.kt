package kr.co.booktalk.config

import kr.co.booktalk.domain.webSocket.ApiWebSocketHandler
import kr.co.booktalk.domain.webSocket.WebSocketJwtHandshakeInterceptor
import org.springframework.context.annotation.Configuration
import org.springframework.web.socket.config.annotation.EnableWebSocket
import org.springframework.web.socket.config.annotation.WebSocketConfigurer
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry

@Configuration
@EnableWebSocket
class WebSocketConfig(
    private val apiWebSocketHandler: ApiWebSocketHandler,
    private val webSocketJwtHandshakeInterceptor: WebSocketJwtHandshakeInterceptor,
    private val appProperties: AppProperties
) : WebSocketConfigurer {

    override fun registerWebSocketHandlers(registry: WebSocketHandlerRegistry) {
        registry.addHandler(apiWebSocketHandler, "/ws")
            .addInterceptors(webSocketJwtHandshakeInterceptor)
            .setAllowedOriginPatterns(*appProperties.cors.allowedOrigins.toTypedArray())
    }
}
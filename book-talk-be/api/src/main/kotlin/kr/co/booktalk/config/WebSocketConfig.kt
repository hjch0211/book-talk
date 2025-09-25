package kr.co.booktalk.config

import kr.co.booktalk.presence.PresenceWebSocketHandler
import org.springframework.context.annotation.Configuration
import org.springframework.web.socket.config.annotation.EnableWebSocket
import org.springframework.web.socket.config.annotation.WebSocketConfigurer
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry

@Configuration
@EnableWebSocket
class WebSocketConfig(
    private val presenceWebSocketHandler: PresenceWebSocketHandler,
    private val jwtHandshakeInterceptor: JwtHandshakeInterceptor,
    private val appProperties: AppProperties
) : WebSocketConfigurer {

    override fun registerWebSocketHandlers(registry: WebSocketHandlerRegistry) {
        registry.addHandler(presenceWebSocketHandler, "/ws/presence")
            .addInterceptors(jwtHandshakeInterceptor)
            .setAllowedOriginPatterns(*appProperties.cors.allowedOrigins.toTypedArray())
    }
}
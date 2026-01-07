package kr.co.booktalk

import io.github.oshai.kotlinlogging.KotlinLogging
import kr.co.booktalk.domain.auth.JwtService
import org.springframework.http.server.ServerHttpRequest
import org.springframework.http.server.ServerHttpResponse
import org.springframework.stereotype.Component
import org.springframework.web.socket.WebSocketHandler
import org.springframework.web.socket.server.HandshakeInterceptor
import java.net.URLDecoder

@Component
class WebSocketJwtHandshakeInterceptor(
    private val jwtService: JwtService,
) : HandshakeInterceptor {
    private val logger = KotlinLogging.logger {}

    override fun beforeHandshake(
        request: ServerHttpRequest,
        response: ServerHttpResponse,
        wsHandler: WebSocketHandler,
        attributes: MutableMap<String, Any>
    ): Boolean {
        return try {
            val query = request.uri.query
            val token = extractTokenFromQuery(query)
            if (token == null) {
                logger.warn { "WebSocket 연결 시도: 토큰이 없음" }
                return false
            }

            // JWT 토큰 검증
            val claims = jwtService.validateAccess(token)
            val accountId = claims.subject

            // accountId 유효성 검사
            if (accountId.isNullOrBlank()) {
                logger.warn { "WebSocket 연결 시도: accountId가 없음" }
                return false
            }

            // WebSocket 세션 속성에 계정 정보 저장
            attributes["accountId"] = accountId

            true
            /** GlocalAdvice 범주 밖이므로 예외 핸들링 */
        } catch (e: Exception) {
            logger.warn(e) { "WebSocket 인증 실패: ${e.message}" }
            false
        }
    }

    override fun afterHandshake(
        request: ServerHttpRequest,
        response: ServerHttpResponse,
        wsHandler: WebSocketHandler,
        exception: Exception?
    ) {
        // 핸드셰이크 완료 후 처리할 내용이 있다면 여기에 구현
    }

    private fun extractTokenFromQuery(query: String?): String? {
        if (query == null) return null

        return query.split("&")
            .find { it.startsWith("token=") }
            ?.substringAfter("token=")
            ?.let { URLDecoder.decode(it, "UTF-8") }
    }
}
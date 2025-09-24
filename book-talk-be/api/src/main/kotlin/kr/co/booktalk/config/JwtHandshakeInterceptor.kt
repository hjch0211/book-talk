package kr.co.booktalk.config

import io.github.oshai.kotlinlogging.KotlinLogging
import kr.co.booktalk.domain.auth.JwtService
import org.springframework.http.server.ServerHttpRequest
import org.springframework.http.server.ServerHttpResponse
import org.springframework.stereotype.Component
import org.springframework.web.socket.WebSocketHandler
import org.springframework.web.socket.server.HandshakeInterceptor

@Component
class JwtHandshakeInterceptor(
    private val jwtService: JwtService
) : HandshakeInterceptor {
    private val logger = KotlinLogging.logger {}

    override fun beforeHandshake(
        request: ServerHttpRequest,
        response: ServerHttpResponse,
        wsHandler: WebSocketHandler,
        attributes: MutableMap<String, Any>
    ): Boolean {
        return try {
            // 쿼리 파라미터에서 토큰 추출
            val query = request.uri.query
            logger.info { "WebSocket 연결 시도: query=$query" }

            val token = extractTokenFromQuery(query)

            if (token == null) {
                logger.warn { "WebSocket 연결 시도: 토큰이 없음" }
                return false
            }

            logger.info { "WebSocket 토큰 추출 성공: ${token.take(20)}..." }

            // JWT 토큰 검증
            val claims = jwtService.validateAccess(token)
            val userId = claims.subject

            // WebSocket 세션 속성에 사용자 정보 저장
            attributes["userId"] = userId
            attributes["token"] = token

            logger.info { "WebSocket 인증 성공: userId=$userId" }
            true

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
            ?.let { java.net.URLDecoder.decode(it, "UTF-8") }
    }
}
package kr.co.booktalk.domain.auth

import kr.co.booktalk.httpUnauthenticated
import org.springframework.core.MethodParameter
import org.springframework.stereotype.Component
import org.springframework.web.bind.support.WebDataBinderFactory
import org.springframework.web.context.request.NativeWebRequest
import org.springframework.web.method.support.HandlerMethodArgumentResolver
import org.springframework.web.method.support.ModelAndViewContainer

data class AuthAccount(
    val id: String,
)

@Component
class AuthAccountArgumentResolver(
    private val jwtService: JwtService,
) : HandlerMethodArgumentResolver {
    override fun supportsParameter(parameter: MethodParameter): Boolean {
        return parameter.getParameterType() == AuthAccount::class.java
    }

    override fun resolveArgument(
        parameter: MethodParameter,
        mavContainer: ModelAndViewContainer?,
        webRequest: NativeWebRequest,
        binderFactory: WebDataBinderFactory?
    ): Any? {
        val token = webRequest.getHeader("Authorization")
            ?.takeIf { it.isNotBlank() }
            ?.removePrefix("Bearer ")
            ?: httpUnauthenticated("유효하지 않은 토큰입니다.")
        val decoded = jwtService.decodeAccess(token)
        return AuthAccount(
            id = decoded.subject,
        )
    }
}
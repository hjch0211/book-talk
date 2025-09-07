package kr.co.booktalk.config

import kr.co.booktalk.domain.auth.AuthAccountArgumentResolver
import org.springframework.context.annotation.Configuration
import org.springframework.web.method.support.HandlerMethodArgumentResolver
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@Configuration
class WebConfig(
    private val authAccountArgumentResolver: AuthAccountArgumentResolver,
) : WebMvcConfigurer {
    override fun addArgumentResolvers(argumentResolvers: MutableList<HandlerMethodArgumentResolver>) {
        argumentResolvers.add(authAccountArgumentResolver)
    }
}
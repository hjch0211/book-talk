package kr.co.booktalk.config

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties(prefix = "app")
data class AppProperties(
    val cors: CorsProperties = CorsProperties(),
) {
    data class CorsProperties(
        val allowedOrigins: List<String> = emptyList(),
    )
}
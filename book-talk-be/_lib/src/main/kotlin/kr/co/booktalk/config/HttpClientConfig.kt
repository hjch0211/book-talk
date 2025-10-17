package kr.co.booktalk.config

import io.github.oshai.kotlinlogging.KotlinLogging
import io.ktor.client.*
import io.ktor.client.engine.cio.*
import io.ktor.client.plugins.*
import io.ktor.client.plugins.contentnegotiation.*
import io.ktor.serialization.jackson.*
import kr.co.booktalk.client.BookClient
import kr.co.booktalk.client.NoOpBookClient
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class HttpClientConfig {
    private val logger = KotlinLogging.logger {}

    @Bean
    fun httpClient(): HttpClient {
        return HttpClient(CIO) {
            install(ContentNegotiation) {
                jackson { disable(com.fasterxml.jackson.databind.DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES) }
            }
            install(HttpTimeout)
        }
    }

    @Bean
    fun bookClient(
        httpClient: HttpClient,
        properties: LibProperties
    ): BookClient {
        if (!properties.naver.isValid()) {
            logger.warn { "Naver API 설정이 비었습니다. NoOpBookClient를 생성합니다." }
            return NoOpBookClient()
        } else {
            return kr.co.booktalk.client.NaverBookClient(
                httpClient = httpClient,
                properties = properties.naver
            )
        }
    }
}
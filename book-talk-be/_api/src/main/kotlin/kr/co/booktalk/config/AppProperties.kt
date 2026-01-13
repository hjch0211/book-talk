package kr.co.booktalk.config

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties(prefix = "app")
data class AppProperties(
    val cors: CorsProperties = CorsProperties(),
    val debate: DebateProperties = DebateProperties(),
) {
    data class CorsProperties(
        val allowedOrigins: List<String> = emptyList(),
    )

    data class DebateProperties(
        /** 토론 최대 참여자수 */
        val maxMemberCount: Long = 10,
        /** 토론 라운드 발언자 발언 시간(초) */
        val roundSpeakerSeconds: Long = 60,
    )
}
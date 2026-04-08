package kr.co.booktalk.config

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties(prefix = "batch")
data class BatchProperties(
    val debate: DebateProperties = DebateProperties(),
) {
    data class DebateProperties(
        /** 참여자 없는 토론 자동 종료 기준 시간(초), 기본값 24시간 */
        val emptyCloseAfterSeconds: Long = 24 * 60 * 60,
        /** 토론 생성 후 자동 종료 기준 시간(초), 기본값 7일 */
        val expireAfterSeconds: Long = 7 * 24 * 60 * 60,
    )
}
package kr.co.booktalk.config

import org.springframework.boot.context.properties.ConfigurationProperties

@ConfigurationProperties(prefix = "app")
data class AppProperties(
    val cors: CorsProperties = CorsProperties(),
    val mq: MessageQueueProperties = MessageQueueProperties()
) {
    data class CorsProperties(
        val allowedOrigins: List<String> = emptyList(),
    )

    data class MessageQueueProperties(
        /** Publisher 활성화 여부 */
        val pubEnabled: Boolean = false,
        /** Subscriber 활성화 여부 */
        val subEnabled: Boolean = false,
    ) {
        fun isValid(): Boolean = pubEnabled && subEnabled
    }
}
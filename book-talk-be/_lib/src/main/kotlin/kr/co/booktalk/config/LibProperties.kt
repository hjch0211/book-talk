package kr.co.booktalk.config

import org.springframework.boot.context.properties.ConfigurationProperties
import java.time.Duration

@ConfigurationProperties(prefix = "lib")
data class LibProperties(
    val aes: AesProperties = AesProperties(),
    val jwt: JwtProperties = JwtProperties(),
    val naver: NaverProperties = NaverProperties(),
    val slack: SlackProperties = SlackProperties(),
    val ai: AiProperties = AiProperties(),
) {
    data class AesProperties(
        val secretString: String = "",
    ) {
        fun isValid(): Boolean = secretString.isNotBlank()
    }

    data class JwtProperties(
        val access: TokenProperties = TokenProperties(),
        val refresh: TokenProperties = TokenProperties()
    ) {
        fun isValid(): Boolean = access.isValid() && refresh.isValid()
    }

    data class TokenProperties(
        val secret: String = "",
        val issuer: String = "",
        val audience: String = "",
        val expiringTime: Duration = Duration.ofMinutes(30),
    ) {
        fun isValid(): Boolean =
            secret.isNotBlank() && issuer.isNotBlank() && audience.isNotBlank() && expiringTime.isPositive
    }

    data class NaverProperties(
        val clientId: String = "",
        val clientSecret: String = "",
    ) {
        fun isValid(): Boolean = clientId.isNotBlank() && clientSecret.isNotBlank()
    }

    data class SlackProperties(
        val webhookUrl: String = "",
    ) {
        fun isValid(): Boolean = webhookUrl.isNotBlank()
    }

    data class AiProperties(
        val baseUrl: String = "",
    ) {
        fun isValid(): Boolean = baseUrl.isNotBlank()
    }
}
package kr.co.booktalk.client

import io.github.oshai.kotlinlogging.KotlinLogging
import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.request.*
import io.ktor.client.request.forms.*
import io.ktor.http.*
import kr.co.booktalk.config.LibProperties

/**
 * Google OAuth 2.0 인증 클라이언트
 */
interface GoogleAuthClient {
    suspend fun exchangeCode(code: String): GoogleUserInfo
}

data class GoogleUserInfo(
    val email: String,
)

private data class GoogleTokenResponse(
    val access_token: String,
)

private data class GoogleRawUserInfo(
    val email: String,
)

class GoogleOAuthClient(
    private val httpClient: HttpClient,
    private val properties: LibProperties.GoogleProperties,
) : GoogleAuthClient {
    override suspend fun exchangeCode(code: String): GoogleUserInfo {
        val tokenResponse: GoogleTokenResponse = httpClient.post("https://oauth2.googleapis.com/token") {
            contentType(ContentType.Application.FormUrlEncoded)
            setBody(FormDataContent(Parameters.build {
                append("code", code)
                append("client_id", properties.clientId)
                append("client_secret", properties.clientSecret)
                append("redirect_uri", properties.redirectUri)
                append("grant_type", "authorization_code")
            }))
        }.body()

        val userInfo: GoogleRawUserInfo = httpClient.get("https://www.googleapis.com/oauth2/v2/userinfo") {
            bearerAuth(tokenResponse.access_token)
        }.body()

        return GoogleUserInfo(userInfo.email)
    }
}

class NoOpGoogleAuthClient : GoogleAuthClient {
    private val logger = KotlinLogging.logger {}

    override suspend fun exchangeCode(code: String): GoogleUserInfo {
        logger.warn { "[NoOp] Google OAuth exchange skipped (Google config missing)." }
        return GoogleUserInfo(email = "")
    }
}
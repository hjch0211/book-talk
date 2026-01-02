package kr.co.booktalk.client

import io.github.oshai.kotlinlogging.KotlinLogging
import io.ktor.client.*
import io.ktor.client.request.*
import io.ktor.http.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kr.co.booktalk.config.LibProperties

/**
 * 모니터링 클라이언트
 */
interface MonitorClient {
    suspend fun send(request: SendRequest): Unit
}

data class SendRequest(
    val title: String,
    val message: String,
    val stackTrace: String,
    val level: Level,
) {
    enum class Level {
        ERROR
    }
}

/**
 * see [Slack API](https://api.slack.com/messaging/webhooks)
 */
class SlackMonitorClient(
    private val httpClient: HttpClient,
    private val properties: LibProperties.SlackProperties,
) : MonitorClient {
    private val logger = KotlinLogging.logger {}

    override suspend fun send(request: SendRequest) {
        runCatching {
            val response = withContext(Dispatchers.IO) {
                httpClient.post(properties.webhookUrl) {
                    contentType(ContentType.Application.Json)
                    setBody(mapOf("blocks" to buildBlocks(request)))
                }
            }

            if (!response.status.isSuccess()) {
                logger.error { "Slack 알림 전송 실패: ${response.status}" }
            }
        }.onFailure {
            /** livelock 방지를 위해 예외 전파 x */
            logger.error(it) { "Slack 알림 처리 중 예외 발생" }
        }
    }

    private fun buildBlocks(request: SendRequest): List<Any> {
        return when (request.level) {
            SendRequest.Level.ERROR -> listOf(
                headerBlock(":rotating_light: Server Error"),
                sectionBlock(
                    """
                *- message*
                ${request.message}
                """.trimIndent()
                ),
                dividerBlock(),
                sectionBlock(
                    """
                *- stack trace*
                ``` 
                ${request.stackTrace}
                ```
                """.trimIndent()
                )
            )
        }
    }

    private fun headerBlock(text: String) =
        mapOf(
            "type" to "header",
            "text" to mapOf(
                "type" to "plain_text",
                "text" to text
            )
        )

    private fun sectionBlock(text: String) =
        mapOf(
            "type" to "section",
            "text" to mapOf(
                "type" to "mrkdwn",
                "text" to text
            )
        )

    private fun dividerBlock() =
        mapOf("type" to "divider")
}

class NoOpMonitorClient : MonitorClient {
    private val logger = KotlinLogging.logger {}

    override suspend fun send(request: SendRequest) {
        logger.warn { "[NoOp] monitor send: $request" }
    }
}

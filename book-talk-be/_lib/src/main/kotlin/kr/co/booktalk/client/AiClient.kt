package kr.co.booktalk.client

import io.github.oshai.kotlinlogging.KotlinLogging
import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.request.*
import io.ktor.http.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kr.co.booktalk.config.LibProperties

/** AI 서버 클라이언트 */
interface AiClient {
    /** 토론 요약 생성 */
    suspend fun summarizeDebate(request: SummarizeRequest)
}

data class SummarizeRequest(
    val debateId: String,
)

/** book-talk-ai */
class AiServerClient(
    private val httpClient: HttpClient,
    private val properties: LibProperties.AiProperties,
) : AiClient {
    private val logger = KotlinLogging.logger {}

    override suspend fun summarizeDebate(request: SummarizeRequest) {
        val url = "${properties.baseUrl}/debates/summarization"

        withContext(Dispatchers.IO) {
            httpClient.post(url) {
                contentType(ContentType.Application.Json)
                setBody(mapOf("debateId" to request.debateId))
            }
        }.also {
            if (!it.status.isSuccess()) {
                logger.error { "AI 서버 summarize 호출 실패: ${it.status}" }
                throw RuntimeException("AI 서버 호출 실패: ${it.status}")
            }
        }
    }
}

class NoOpAiClient : AiClient {
    private val logger = KotlinLogging.logger {}

    override suspend fun summarizeDebate(request: SummarizeRequest) {
        logger.warn { "[NoOp] summarize: $request" }
    }
}
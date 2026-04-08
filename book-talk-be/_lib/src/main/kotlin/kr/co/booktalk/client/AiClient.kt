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
    /** AI 토론 채팅 */
    suspend fun chat(request: AiChatClientRequest)
    /** AI 검색 */
    suspend fun searchWithAi(request: AiSearchRequest): List<AiSearchResult>
}

data class SummarizeRequest(
    val debateId: String,
)

data class AiChatClientRequest(
    val chatId: String,
    val message: String,
    val role: String = "user",
)

data class AiSearchRequest(
    val bookTitle: String,
    val topic: String,
    val includeDomains: List<String> = emptyList(),
)

data class AiSearchResult(
    val title: String,
    val url: String,
    val content: String,
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

    override suspend fun chat(request: AiChatClientRequest) {
        val url = "${properties.baseUrl}/debates/chats/messages"

        withContext(Dispatchers.IO) {
            httpClient.post(url) {
                contentType(ContentType.Application.Json)
                setBody(mapOf("chatId" to request.chatId, "message" to request.message, "role" to request.role))
            }
        }.also {
            if (!it.status.isSuccess()) {
                logger.error { "AI 서버 chat 호출 실패: ${it.status}" }
                throw RuntimeException("AI 서버 호출 실패: ${it.status}")
            }
        }
    }

    override suspend fun searchWithAi(request: AiSearchRequest): List<AiSearchResult> {
        val url = "${properties.baseUrl}/debates/search"

        return withContext(Dispatchers.IO) {
            httpClient.post(url) {
                contentType(ContentType.Application.Json)
                setBody(mapOf(
                    "bookTitle" to request.bookTitle,
                    "topic" to request.topic,
                    "includeDomains" to request.includeDomains,
                ))
            }
        }.also {
            if (!it.status.isSuccess()) {
                logger.error { "AI 서버 searchWithAi 호출 실패: ${it.status}" }
                throw RuntimeException("AI 서버 호출 실패: ${it.status}")
            }
        }.body()
    }
}

class NoOpAiClient : AiClient {
    private val logger = KotlinLogging.logger {}

    override suspend fun summarizeDebate(request: SummarizeRequest) {
        logger.warn { "[NoOp] summarize: $request" }
    }

    override suspend fun chat(request: AiChatClientRequest) {
        logger.warn { "[NoOp] chat: $request" }
    }

    override suspend fun searchWithAi(request: AiSearchRequest): List<AiSearchResult> {
        logger.warn { "[NoOp] searchWithAi: $request" }
        return emptyList()
    }
}

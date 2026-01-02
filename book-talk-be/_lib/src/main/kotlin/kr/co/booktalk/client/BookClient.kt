package kr.co.booktalk.client

import io.github.oshai.kotlinlogging.KotlinLogging
import io.ktor.client.*
import io.ktor.client.call.*
import io.ktor.client.request.*
import io.ktor.http.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kr.co.booktalk.config.LibProperties
import java.net.URLEncoder

/**
 * 책 정보 API 클라이언트
 */
interface BookClient {
    suspend fun search(request: SearchRequest): SearchResponse
}

data class SearchRequest(
    val query: String,
    val page: Int = 1,
    val size: Int = 10,
)

data class SearchResponse(
    val content: List<BookData>,
    val page: Int,
    val size: Int,
    val total: Long,
    val isLastPage: Boolean
) {
    data class BookData(
        val isbn: String,
        val title: String,
        val author: String,
        val publisher: String,
        val description: String,
        val imageUrl: String,
    )
}

/**
 * See [Naver 책검색 API](https://developers.naver.com/docs/serviceapi/search/book/book.md)
 */
class NaverBookClient(
    private val httpClient: HttpClient,
    private val properties: LibProperties.NaverProperties
) : BookClient {
    override suspend fun search(request: SearchRequest): SearchResponse {
        val query = withContext(Dispatchers.IO) { URLEncoder.encode(request.query, "UTF-8") }
        val start = (request.page - 1) * request.size + 1
        val url = "https://openapi.naver.com/v1/search/book.json?query=$query&display=${request.size}&start=$start"

        val response = httpClient.get(url) {
            header("X-Naver-Client-Id", properties.clientId)
            header("X-Naver-Client-Secret", properties.clientSecret)
            header(HttpHeaders.Accept, ContentType.Application.Json.toString())
        }.also { if (!it.status.isSuccess()) throw RuntimeException("Naver API 호출 실패: ${it.status}") }

        val apiResponse = response.body<NaverBookApiResponse>()

        return SearchResponse(
            content = apiResponse.items.map {
                SearchResponse.BookData(
                    isbn = it.isbn,
                    title = it.title,
                    author = it.author,
                    publisher = it.publisher,
                    description = it.description,
                    imageUrl = it.image
                )
            },
            page = request.page,
            size = request.size,
            total = apiResponse.total.toLong(),
            isLastPage = apiResponse.display < request.size
        )
    }
}

data class NaverBookApiResponse(
    val lastBuildDate: String,
    val total: Int,
    val start: Int,
    val display: Int,
    val items: List<NaverBookItem>
)

data class NaverBookItem(
    val title: String,
    val link: String,
    val image: String,
    val author: String,
    val isbn: String,
    val publisher: String,
    val description: String,
)

class NoOpBookClient : BookClient {
    private val logger = KotlinLogging.logger {}

    override suspend fun search(request: SearchRequest): SearchResponse {
        logger.warn { "[NoOp] search book: $request" }
        return SearchResponse(
            content = emptyList(),
            page = request.page,
            size = request.size,
            total = 0,
            isLastPage = true
        )
    }
}
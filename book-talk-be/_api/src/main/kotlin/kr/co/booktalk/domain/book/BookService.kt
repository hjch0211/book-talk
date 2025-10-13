package kr.co.booktalk.domain.book

import kotlinx.coroutines.runBlocking
import kr.co.booktalk.client.BookClient
import org.springframework.stereotype.Service

@Service
class BookService(
    private val bookClient: BookClient,
) {
    fun search(request: SearchBookRequest): SearchBookResponse = runBlocking {
        bookClient.search(request.toClientRequest()).toResponse()
    }
}
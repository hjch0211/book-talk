package kr.co.booktalk.domain.book

import kr.co.booktalk.client.SearchRequest
import kr.co.booktalk.client.SearchResponse

fun SearchBookRequest.toClientRequest(): SearchRequest {
    return SearchRequest(
        query = query,
        page = page ?: 1,
        size = size ?: 10
    )
}

fun SearchResponse.toResponse(): SearchBookResponse {
    return SearchBookResponse(
        content = content.map {
            SearchBookResponse.BookData(
                title = it.title,
                author = it.author,
                publisher = it.publisher,
                imageUrl = it.imageUrl
            )
        },
        page = page,
        size = size,
        total = total,
        isLastPage = isLastPage
    )
}
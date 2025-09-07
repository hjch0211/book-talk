package kr.co.booktalk.domain.book

data class SearchBookRequest(
    val query: String,
    val page: Int? = 1,
    val size: Int? = 10
)
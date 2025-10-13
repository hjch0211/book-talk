package kr.co.booktalk.domain.book

data class SearchBookResponse(
    val content: List<BookData>,
    val page: Int,
    val size: Int,
    val total: Long,
    val isLastPage: Boolean
) {
    data class BookData(
        val title: String,
        val author: String,
        val publisher: String,
        val imageUrl: String,
    )
}
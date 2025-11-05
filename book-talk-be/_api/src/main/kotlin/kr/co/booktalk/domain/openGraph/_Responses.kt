package kr.co.booktalk.domain.openGraph

data class FetchOpenGraphResponse(
    val url: String,
    val title: String?,
    val description: String?,
    val image: String?,
    val siteName: String?,
    val type: String?
)
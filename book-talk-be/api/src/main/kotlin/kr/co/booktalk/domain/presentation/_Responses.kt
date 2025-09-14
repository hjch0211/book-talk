package kr.co.booktalk.domain.presentation

data class FindOneResponse(
    val id: String,
    val accountId: String,
    val debateId: String,
    val content: String
)
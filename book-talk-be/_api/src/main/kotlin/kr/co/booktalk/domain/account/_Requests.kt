package kr.co.booktalk.domain.account

data class CreateRequest(
    val name: String,
)

data class PatchMyRequest(
    val name: String
)
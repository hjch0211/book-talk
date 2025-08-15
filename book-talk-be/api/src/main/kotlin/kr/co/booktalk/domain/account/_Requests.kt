package kr.co.booktalk.domain.account

data class CreateRequest(
    val email: String,
    val name: String,
    val password: String,
)
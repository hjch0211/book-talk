package kr.co.booktalk.domain.auth

data class CreateTokensResponse(
    val accessToken: String,
    val refreshToken: String,
)
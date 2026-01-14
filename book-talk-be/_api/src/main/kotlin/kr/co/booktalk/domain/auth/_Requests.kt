package kr.co.booktalk.domain.auth

data class CreateTokensRequest(
    val id: String,
)

data class SignUpRequest(
    val name: String,
)

data class ValidateDuplicateSignInRequest(
    val name: String
)

data class SignInRequest(
    val name: String,
)

data class RefreshRequest(
    val refreshToken: String,
)
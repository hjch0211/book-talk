package kr.co.booktalk.domain.auth

data class SignUpRequest(
    val email: String,
    val name: String,
    val password: String,
)

data class SignInRequest(
    val email: String,
    val password: String,
)

data class SendEmailCodeRequest(
    val email: String,
)

data class VerifyEmailCodeRequest(
    val email: String,
    val code: String,
)

data class RefreshRequest(
    val refreshToken: String,
)
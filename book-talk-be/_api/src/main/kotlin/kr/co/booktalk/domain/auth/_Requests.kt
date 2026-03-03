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

data class SendSignUpOtpRequest(
    val email: String,
)

data class VerifySignUpOtpRequest(
    val email: String,
    val code: String,
)

data class SendPasswordResetOtpRequest(
    val email: String,
)

data class VerifyPasswordResetOtpRequest(
    val email: String,
    val code: String,
)

data class ResetPasswordRequest(
    val email: String,
    val newPassword: String,
)

data class RefreshRequest(
    val refreshToken: String,
)

data class VerifyPasswordRequest(
    val password: String,
)

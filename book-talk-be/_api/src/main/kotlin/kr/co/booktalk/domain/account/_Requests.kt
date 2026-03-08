package kr.co.booktalk.domain.account

data class PatchMyRequest(
    val name: String
)

data class PatchMyPasswordRequest(
    val currentPassword: String,
    val newPassword: String,
)
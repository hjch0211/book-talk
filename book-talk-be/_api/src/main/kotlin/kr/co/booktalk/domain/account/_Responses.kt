package kr.co.booktalk.domain.account

import java.time.Instant

data class FindMyResponse(
    val id: String,
    val email: String,
    val name: String? = null,
    val createdAt: Instant,
)
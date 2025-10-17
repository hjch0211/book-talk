package kr.co.booktalk.domain.account

import java.time.Instant

data class FindMyResponse(
    val id: String,
    val name: String,
    val createdAt: Instant,
)
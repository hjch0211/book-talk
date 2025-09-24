package kr.co.booktalk.domain.presentation

import java.time.Instant

data class FindOneResponse(
    val id: String,
    val accountId: String,
    val debateId: String,
    val content: String,
    val lastUpdatedAt: Instant,
)
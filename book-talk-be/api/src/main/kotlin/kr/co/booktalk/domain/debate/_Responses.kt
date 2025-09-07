package kr.co.booktalk.domain.debate

import java.time.Instant

data class FindOneResponse(
    val id: String,
    val bookImageUrl: String,
    val topic: String,
    val description: String? = null,
    val headCount: Int,
    val startedAt: Instant,
    val closedAt: Instant? = null,
    val createdAt: Instant,
    val updatedAt: Instant,
    val archivedAt: Instant? = null,
)
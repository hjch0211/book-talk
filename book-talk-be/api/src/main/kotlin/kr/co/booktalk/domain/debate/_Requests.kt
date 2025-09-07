package kr.co.booktalk.domain.debate

import java.time.Instant

data class CreateRequest(
    val bookImageUrl: String,
    val topic: String,
    val description: String?,
    val headCount: Int,
    val startedAt: Instant,
)

data class JoinRequest(
    val debateId: String,
)
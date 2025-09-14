package kr.co.booktalk.domain.debate

import kr.co.booktalk.domain.DebateMemberRole
import java.time.Instant

data class FindOneResponse(
    val id: String,
    val members: List<MemberInfo>,
    val presentations: List<PresentationInfo>,
    val bookImageUrl: String,
    val topic: String,
    val description: String? = null,
    val headCount: Int,
    val startedAt: Instant,
    val closedAt: Instant? = null,
    val createdAt: Instant,
    val updatedAt: Instant,
    val archivedAt: Instant? = null,
) {
    data class MemberInfo(
        val id: String,
        val role: DebateMemberRole,
    )

    data class PresentationInfo(
        val id: String,
        val accountId: String,
    )
}
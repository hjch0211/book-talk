package kr.co.booktalk.domain.debate

import kr.co.booktalk.domain.DebateMemberRole
import kr.co.booktalk.domain.DebateRoundType
import java.time.Instant

data class CreateResponse(
    val id: String,
)

data class FindOneResponse(
    val id: String,
    val members: List<MemberInfo>,
    val presentations: List<PresentationInfo>,
    val currentRound: RoundInfo? = null,
    val bookImageUrl: String,
    val topic: String,
    val description: String? = null,
    val closedAt: Instant? = null,
    val createdAt: Instant,
    val updatedAt: Instant,
    val archivedAt: Instant? = null,
) {
    data class MemberInfo(
        val id: String,
        val name: String,
        val role: DebateMemberRole,
    )

    data class PresentationInfo(
        val id: String,
        val accountId: String,
    )

    data class RoundInfo(
        val id: Long,
        val type: DebateRoundType,
        val currentSpeakerId: String,
        val nextSpeakerId: String? = null,
        val createdAt: Instant,
        val endedAt: Instant? = null,
    )
}
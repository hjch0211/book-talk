package kr.co.booktalk.domain.debate

import kr.co.booktalk.domain.DebateMemberRole
import kr.co.booktalk.domain.DebateRoundType
import java.time.Instant

data class CreateResponse(
    val id: String,
)

data class CreateRoundResponse(
    val id: Long,
)

data class FindOneResponse(
    val id: String,
    val members: List<MemberInfo>,
    val presentations: List<PresentationInfo>,
    val currentRound: RoundInfo? = null,
    val bookInfo: BookInfo,
    val topic: String,
    val description: String? = null,
    val closedAt: Instant? = null,
    val createdAt: Instant,
    val updatedAt: Instant,
    val archivedAt: Instant? = null,
) {
    data class BookInfo(
        val title: String,
        val author: String,
        val description: String? = null,
        val imageUrl: String? = null,
    )

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
        val currentSpeakerId: Long? = null,
        val currentSpeakerAccountId: String? = null,
        val nextSpeakerAccountId: String? = null,
        val currentSpeakerEndedAt: Instant? = null,
        val createdAt: Instant,
        val endedAt: Instant? = null,
    )
}

data class CreateChatResponse(
    val id: Long,
    val debateId: String,
    val accountId: String,
    val accountName: String,
    val content: String,
    val createdAt: Instant
)

data class ChatResponse(
    val id: Long,
    val debateId: String,
    val accountId: String,
    val accountName: String,
    val content: String,
    val createdAt: Instant
)

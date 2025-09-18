package kr.co.booktalk.domain.debate

import kr.co.booktalk.domain.DebateRoundType
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

data class CreateRoundRequest(
    val debateId: String,
    val type: DebateRoundType,
    val nextSpeakerId: String,
)

data class PatchRoundRequest(
    val debateRoundId: Long,
    /** 다음 발언자 예약 */
    val nextSpeakerId: String? = null,
    /** 토론 라운드 종료 */
    val ended: Boolean? = null,
)

data class CloseRoundRequest(
    val debateId: String,
)

data class CreateRoundSpeakerRequest(
    val debateRoundId: Long,
    val nextSpeakerId: String,
)

data class PatchRoundSpeakerRequest(
    val debateRoundSpeakerId: Long,
    /** 발언 시간 증가 */
    val extension: Boolean? = null,
    /** 발언 종료 */
    val ended: Boolean? = null,
)

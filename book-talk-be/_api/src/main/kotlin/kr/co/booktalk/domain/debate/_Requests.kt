package kr.co.booktalk.domain.debate

import kr.co.booktalk.domain.DebateRoundType
import org.openapitools.jackson.nullable.JsonNullable

data class CreateRequest(
    val topic: String,
    val description: String?,
    val bookTitle: String,
    val bookISBN: String,
    val bookAuthor: String,
    val bookDescription: String? = null,
    val bookImageUrl: String? = null,
)

data class JoinRequest(
    val debateId: String,
)

data class UpdateRequest(
    val debateId: String,
    val roundType: DebateRoundType,
)

data class CreateRoundRequest(
    val debateId: String,
    val type: DebateRoundType,
)

data class PatchRoundRequest(
    val debateRoundId: Long,
    /** 다음 발언자 예약 */
    val nextSpeakerId: JsonNullable<String>? = JsonNullable.undefined(),
    /** 토론 라운드 종료 */
    val ended: JsonNullable<Boolean>? = JsonNullable.undefined(),
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

data class CreateChatRequest(
    val debateId: String,
    val content: String
)
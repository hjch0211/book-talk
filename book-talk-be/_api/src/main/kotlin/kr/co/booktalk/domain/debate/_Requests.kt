package kr.co.booktalk.domain.debate

import kr.co.booktalk.WebSocketMessage
import kr.co.booktalk.domain.DebateRoundType
import org.openapitools.jackson.nullable.JsonNullable

enum class WSRequestMessageType {
    C_JOIN_DEBATE,
    C_LEAVE_DEBATE,
    C_HEARTBEAT,
    C_TOGGLE_HAND,
    C_CHAT_MESSAGE,
    C_VOICE_JOIN,
    C_VOICE_OFFER,
    C_VOICE_ANSWER,
    C_VOICE_ICE_CANDIDATE
}

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

data class JoinDebateRequest(
    override val payload: JoinDebatePayload?
) : WebSocketMessage<JoinDebateRequest.JoinDebatePayload> {
    override val type: String = WSRequestMessageType.C_JOIN_DEBATE.name

    data class JoinDebatePayload(
        val debateId: String,
        val accountId: String,
        val accountName: String,
        val voiceEnabled: Boolean = true  // 기본값: voice chat 활성화
    )
}

data class LeaveDebateRequest(
    override val payload: LeaveDebatePayload?
) : WebSocketMessage<LeaveDebateRequest.LeaveDebatePayload> {
    override val type: String = WSRequestMessageType.C_LEAVE_DEBATE.name

    data class LeaveDebatePayload(
        val debateId: String,
        val accountId: String
    )
}

data class HeartbeatRequest(
    override val payload: HeartbeatPayload?
) : WebSocketMessage<HeartbeatRequest.HeartbeatPayload> {
    override val type: String = WSRequestMessageType.C_HEARTBEAT.name

    data class HeartbeatPayload(
        val accountId: String? = null
    )
}

data class ToggleHandRequest(
    override val payload: ToggleHandPayload?
) : WebSocketMessage<ToggleHandRequest.ToggleHandPayload> {
    override val type: String = WSRequestMessageType.C_TOGGLE_HAND.name

    data class ToggleHandPayload(
        val debateId: String,
        val accountId: String,
        val accountName: String
    )
}

data class ChatMessageRequest(
    override val payload: ChatMessagePayload?
) : WebSocketMessage<ChatMessageRequest.ChatMessagePayload> {
    override val type: String = WSRequestMessageType.C_CHAT_MESSAGE.name

    data class ChatMessagePayload(
        val debateId: String,
        val chatId: Long
    )
}

// WebRTC Signaling Messages - Client sends (C_ prefix)
data class VoiceJoinRequest(
    override val payload: VoiceJoinPayload?
) : WebSocketMessage<VoiceJoinRequest.VoiceJoinPayload> {
    override val type: String = WSRequestMessageType.C_VOICE_JOIN.name

    data class VoiceJoinPayload(
        val debateId: String,
        val accountId: String
    )
}

data class VoiceOfferRequest(
    override val payload: VoiceOfferPayload?
) : WebSocketMessage<VoiceOfferRequest.VoiceOfferPayload> {
    override val type: String = WSRequestMessageType.C_VOICE_OFFER.name

    data class VoiceOfferPayload(
        val debateId: String,
        val fromId: String,
        val toId: String,
        val offer: Map<String, Any>
    )
}

data class VoiceAnswerRequest(
    override val payload: VoiceAnswerPayload?
) : WebSocketMessage<VoiceAnswerRequest.VoiceAnswerPayload> {
    override val type: String = WSRequestMessageType.C_VOICE_ANSWER.name

    data class VoiceAnswerPayload(
        val debateId: String,
        val fromId: String,
        val toId: String,
        val answer: Map<String, Any>
    )
}

/** Trickle ICE: ICE Candidate 전송 */
data class VoiceIceCandidateRequest(
    override val payload: VoiceIceCandidatePayload?
) : WebSocketMessage<VoiceIceCandidateRequest.VoiceIceCandidatePayload> {
    override val type: String = WSRequestMessageType.C_VOICE_ICE_CANDIDATE.name

    data class VoiceIceCandidatePayload(
        val debateId: String,
        val fromId: String,
        val toId: String,
        val candidate: Map<String, Any>
    )
}

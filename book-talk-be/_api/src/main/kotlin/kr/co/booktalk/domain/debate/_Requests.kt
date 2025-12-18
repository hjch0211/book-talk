package kr.co.booktalk.domain.debate

import kr.co.booktalk.WebSocketMessage
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

data class WS_JoinDebateRequest(
    val debateId: String,
    val accountId: String,
    val accountName: String,
    val voiceEnabled: Boolean = true  // 기본값: voice chat 활성화
) : WebSocketMessage {
    override val type: String = "C_JOIN_DEBATE"
    override val provider: WebSocketMessage.Provider = WebSocketMessage.Provider.CLIENT
}

data class WS_LeaveDebateRequest(
    val debateId: String,
    val accountId: String
) : WebSocketMessage {
    override val type: String = "C_LEAVE_DEBATE"
    override val provider: WebSocketMessage.Provider = WebSocketMessage.Provider.CLIENT
}

data class WS_HeartbeatRequest(
    val accountId: String? = null
) : WebSocketMessage {
    override val type: String = "C_HEARTBEAT"
    override val provider: WebSocketMessage.Provider = WebSocketMessage.Provider.CLIENT
}

data class WS_ToggleHandRequest(
    val debateId: String,
    val accountId: String,
    val accountName: String
) : WebSocketMessage {
    override val type: String = "C_TOGGLE_HAND"
    override val provider: WebSocketMessage.Provider = WebSocketMessage.Provider.CLIENT
}

data class WS_ChatMessageRequest(
    val debateId: String,
    val chatId: Long
) : WebSocketMessage {
    override val type: String = "C_CHAT_MESSAGE"
    override val provider: WebSocketMessage.Provider = WebSocketMessage.Provider.CLIENT
}

// WebRTC Signaling Messages - Client sends (C_ prefix)
data class WS_VoiceJoinRequest(
    val debateId: String,
    val accountId: String
) : WebSocketMessage {
    override val type: String = "C_VOICE_JOIN"
    override val provider: WebSocketMessage.Provider = WebSocketMessage.Provider.CLIENT
}

data class WS_VoiceOfferRequest(
    val debateId: String,
    val fromId: String,
    val toId: String,
    val offer: Map<String, Any>
) : WebSocketMessage {
    override val type: String = "C_VOICE_OFFER"
    override val provider: WebSocketMessage.Provider = WebSocketMessage.Provider.CLIENT
}

data class WS_VoiceAnswerRequest(
    val debateId: String,
    val fromId: String,
    val toId: String,
    val answer: Map<String, Any>
) : WebSocketMessage {
    override val type: String = "C_VOICE_ANSWER"
    override val provider: WebSocketMessage.Provider = WebSocketMessage.Provider.CLIENT
}

/** Trickle ICE: ICE Candidate 전송 */
data class WS_VoiceIceCandidateRequest(
    val debateId: String,
    val fromId: String,
    val toId: String,
    val candidate: Map<String, Any>
) : WebSocketMessage {
    override val type: String = "C_VOICE_ICE_CANDIDATE"
    override val provider: WebSocketMessage.Provider = WebSocketMessage.Provider.CLIENT
}

package kr.co.booktalk.domain.debate

import kr.co.booktalk.Nullable
import kr.co.booktalk.WebSocketMessage
import kr.co.booktalk.domain.DebateRoundType

data class CreateRequest(
    val bookImageUrl: String,
    val topic: String,
    val description: String?,
)

data class JoinRequest(
    val debateId: String,
)

data class CreateRoundRequest(
    val debateId: String,
    val type: DebateRoundType,
)

data class PatchRoundRequest(
    val debateRoundId: Long,
    /** 다음 발언자 예약 */
    val nextSpeakerId: Nullable<String> = Nullable.absent(),
    /** 토론 라운드 종료 */
    val ended: Nullable<Boolean> = Nullable.absent(),
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

// WebRTC Signaling Messages
data class WS_VoiceJoinRequest(
    val debateId: String,
    val accountId: String
) : WebSocketMessage {
    override val type: String = "VOICE_JOIN"
    override val provider: WebSocketMessage.Provider = WebSocketMessage.Provider.CLIENT
}

data class WS_VoiceLeaveRequest(
    val debateId: String,
    val accountId: String
) : WebSocketMessage {
    override val type: String = "VOICE_LEAVE"
    override val provider: WebSocketMessage.Provider = WebSocketMessage.Provider.CLIENT
}

data class WS_VoiceOfferRequest(
    val debateId: String,
    val fromId: String,
    val toId: String,
    val offer: Map<String, Any>
) : WebSocketMessage {
    override val type: String = "VOICE_OFFER"
    override val provider: WebSocketMessage.Provider = WebSocketMessage.Provider.CLIENT
}

data class WS_VoiceAnswerRequest(
    val debateId: String,
    val fromId: String,
    val toId: String,
    val answer: Map<String, Any>
) : WebSocketMessage {
    override val type: String = "VOICE_ANSWER"
    override val provider: WebSocketMessage.Provider = WebSocketMessage.Provider.CLIENT
}

data class WS_VoiceIceRequest(
    val debateId: String,
    val fromId: String,
    val toId: String,
    val iceCandidate: Map<String, Any>
) : WebSocketMessage {
    override val type: String = "VOICE_ICE"
    override val provider: WebSocketMessage.Provider = WebSocketMessage.Provider.CLIENT
}

data class WS_VoiceStateRequest(
    val debateId: String,
    val accountId: String,
    val isMuted: Boolean
) : WebSocketMessage {
    override val type: String = "VOICE_STATE"
    override val provider: WebSocketMessage.Provider = WebSocketMessage.Provider.CLIENT
}

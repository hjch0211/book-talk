package kr.co.booktalk.domain.webSocket

import kr.co.booktalk.WebSocketMessage

enum class WebSocketRequestEventType(val value: String) {
    JOIN_DEBATE("C_JOIN_DEBATE"),
    TOGGLE_HAND("C_TOGGLE_HAND"),
    CHAT("C_CHAT"),
    VOICE_JOIN("C_VOICE_JOIN"),
    VOICE_OFFER("C_VOICE_OFFER"),
    VOICE_ANSWER("C_VOICE_ANSWER"),
    VOICE_ICE_CANDIDATE("C_VOICE_ICE_CANDIDATE")
}

data class JoinDebateRequest(
    override val payload: Payload
) : WebSocketMessage<JoinDebateRequest.Payload> {
    override val type = WebSocketRequestEventType.JOIN_DEBATE.value

    data class Payload(
        val debateId: String,
        val accountId: String,
    )
}

data class ToggleHandRaiseRequest(
    override val payload: Payload
) : WebSocketMessage<ToggleHandRaiseRequest.Payload> {
    override val type = WebSocketRequestEventType.TOGGLE_HAND.value

    data class Payload(
        val debateId: String,
        val accountId: String,
    )
}

data class ChatRequest(
    override val payload: Payload
) : WebSocketMessage<ChatRequest.Payload> {
    override val type = WebSocketRequestEventType.CHAT.value

    data class Payload(
        val debateId: String,
        val accountId: String,
        val content: String
    )
}

data class VoiceJoinRequest(
    val debateId: String,
    val accountId: String
) : WebSocketMessage {
    override val type: String = "C_VOICE_JOIN"
}

data class VoiceOfferRequest(
    val debateId: String,
    val fromId: String,
    val toId: String,
    val offer: Map<String, Any>
) : WebSocketMessage {
    override val type: String = "C_VOICE_OFFER"
}

data class VoiceAnswerRequest(
    val debateId: String,
    val fromId: String,
    val toId: String,
    val answer: Map<String, Any>
) : WebSocketMessage {
    override val type: String = "C_VOICE_ANSWER"
}

/** Trickle ICE: ICE Candidate 전송 */
data class VoiceIceCandidateRequest(
    val debateId: String,
    val fromId: String,
    val toId: String,
    val candidate: Map<String, Any>
) : WebSocketMessage {
    override val type: String = "C_VOICE_ICE_CANDIDATE"
}
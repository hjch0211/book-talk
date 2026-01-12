package kr.co.booktalk.domain.debate

import kr.co.booktalk.WebSocketMessage
import kr.co.booktalk.domain.DebateMemberRole
import kr.co.booktalk.domain.DebateRoundType
import java.time.Instant

enum class WSResponseMessageType {
    S_JOIN_SUCCESS,
    S_JOIN_ERROR,
    S_HEARTBEAT_ACK,
    S_PRESENCE_UPDATE,
    S_HAND_RAISE_UPDATE,
    S_CHAT_MESSAGE,
    S_SPEAKER_UPDATE,
    S_DEBATE_ROUND_UPDATE,
    S_VOICE_JOIN,
    S_VOICE_OFFER,
    S_VOICE_ANSWER,
    S_VOICE_ICE_CANDIDATE
}

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

data class JoinSuccessResponse(
    override val payload: Payload
) : WebSocketMessage<JoinSuccessResponse.Payload> {
    override val type: String = WSResponseMessageType.S_JOIN_SUCCESS.name

    data class Payload(
        val debateId: String,
        val accountId: String
    )
}

data class JoinErrorResponse(
    override val payload: Payload
) : WebSocketMessage<JoinErrorResponse.Payload> {
    override val type: String = WSResponseMessageType.S_JOIN_ERROR.name

    data class Payload(
        val debateId: String,
        val accountId: String,
        val reason: String
    )
}

data class HeartbeatAckResponse(
    override val payload: Payload
) : WebSocketMessage<HeartbeatAckResponse.Payload> {
    override val type: String = WSResponseMessageType.S_HEARTBEAT_ACK.name

    data class Payload(
        val timestamp: Long
    )
}

data class PresenceUpdateResponse(
    override val payload: Payload
) : WebSocketMessage<PresenceUpdateResponse.Payload> {
    override val type: String = WSResponseMessageType.S_PRESENCE_UPDATE.name

    data class Payload(
        val debateId: String,
        val onlineAccounts: List<AccountPresenceInfo>
    ) {
        data class AccountPresenceInfo(
            val accountId: String,
            val accountName: String,
            val status: String,
            val lastHeartbeat: Long
        )
    }
}

data class HandRaiseUpdateResponse(
    override val payload: Payload
) : WebSocketMessage<HandRaiseUpdateResponse.Payload> {
    override val type: String = WSResponseMessageType.S_HAND_RAISE_UPDATE.name

    data class Payload(
        val debateId: String,
        val raisedHands: List<RaisedHandInfo>
    ) {
        data class RaisedHandInfo(
            val accountId: String,
            val accountName: String,
            val raisedAt: Long
        )
    }
}

data class ChatMessageResponse(
    override val payload: Payload
) : WebSocketMessage<ChatMessageResponse.Payload> {
    override val type: String = WSResponseMessageType.S_CHAT_MESSAGE.name

    data class Payload(
        val debateId: String,
        val chatId: Long
    )
}

data class SpeakerUpdateResponse(
    override val payload: Payload
) : WebSocketMessage<SpeakerUpdateResponse.Payload> {
    override val type: String = WSResponseMessageType.S_SPEAKER_UPDATE.name

    data class Payload(
        val debateId: String,
        val currentSpeaker: CurrentSpeakerInfo?,
        val nextSpeaker: NextSpeakerInfo?
    ) {
        data class CurrentSpeakerInfo(
            val accountId: String,
            val accountName: String,
            val endedAt: Long
        )

        data class NextSpeakerInfo(
            val accountId: String,
            val accountName: String
        )
    }
}

data class DebateRoundUpdateResponse(
    override val payload: Payload
) : WebSocketMessage<DebateRoundUpdateResponse.Payload> {
    override val type: String = WSResponseMessageType.S_DEBATE_ROUND_UPDATE.name

    data class Payload(
        val debateId: String,
        val round: RoundInfo,
        val currentSpeaker: CurrentSpeakerInfo
    ) {
        data class RoundInfo(
            val id: Long,
            val type: String,
            val nextSpeakerId: String?,
            val nextSpeakerName: String?,
            val createdAt: Long,
            val endedAt: Long?
        )

        data class CurrentSpeakerInfo(
            val accountId: String?,
            val accountName: String?,
            val endedAt: Long
        )
    }
}

// ============ WebRTC Voice Signaling Response Messages ============

data class VoiceJoinResponse(
    override val payload: Payload
) : WebSocketMessage<VoiceJoinResponse.Payload> {
    override val type: String = WSResponseMessageType.S_VOICE_JOIN.name

    data class Payload(
        val debateId: String,
        val fromId: String
    )
}

data class VoiceOfferResponse(
    override val payload: Payload
) : WebSocketMessage<VoiceOfferResponse.Payload> {
    override val type: String = WSResponseMessageType.S_VOICE_OFFER.name

    data class Payload(
        val debateId: String,
        val fromId: String,
        val toId: String,
        val offer: Map<String, Any?>
    )
}

data class VoiceAnswerResponse(
    override val payload: Payload
) : WebSocketMessage<VoiceAnswerResponse.Payload> {
    override val type: String = WSResponseMessageType.S_VOICE_ANSWER.name

    data class Payload(
        val debateId: String,
        val fromId: String,
        val toId: String,
        val answer: Map<String, Any?>
    )
}

data class VoiceIceCandidateResponse(
    override val payload: Payload
) : WebSocketMessage<VoiceIceCandidateResponse.Payload> {
    override val type: String = WSResponseMessageType.S_VOICE_ICE_CANDIDATE.name

    data class Payload(
        val debateId: String,
        val fromId: String,
        val toId: String,
        val candidate: Map<String, Any?>
    )
}
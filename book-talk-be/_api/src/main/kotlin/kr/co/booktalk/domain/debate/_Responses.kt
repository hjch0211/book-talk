package kr.co.booktalk.domain.debate

import kr.co.booktalk.WebSocketMessage
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
        val currentSpeakerId: String? = null,
        val nextSpeakerId: String? = null,
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

data class WS_JoinSuccessResponse(
    val debateId: String,
    val accountId: String
) : WebSocketMessage {
    override val type: String = "S_JOIN_SUCCESS"
    override val provider: WebSocketMessage.Provider = WebSocketMessage.Provider.API
}

data class WS_JoinErrorResponse(
    val debateId: String,
    val accountId: String,
    val reason: String
) : WebSocketMessage {
    override val type: String = "S_JOIN_ERROR"
    override val provider: WebSocketMessage.Provider = WebSocketMessage.Provider.API
}

data class WS_HeartbeatAckResponse(
    val timestamp: Long
) : WebSocketMessage {
    override val type: String = "S_HEARTBEAT_ACK"
    override val provider: WebSocketMessage.Provider = WebSocketMessage.Provider.API
}

data class WS_PresenceUpdateResponse(
    val debateId: String,
    val onlineAccounts: List<AccountPresenceInfo>
) : WebSocketMessage {
    override val type: String = "S_PRESENCE_UPDATE"
    override val provider: WebSocketMessage.Provider = WebSocketMessage.Provider.API

    data class AccountPresenceInfo(
        val accountId: String,
        val accountName: String,
        val status: String,
        val lastHeartbeat: Long
    )
}

data class WS_HandRaiseUpdateResponse(
    val debateId: String,
    val raisedHands: List<RaisedHandInfo>
) : WebSocketMessage {
    override val type: String = "S_HAND_RAISE_UPDATE"
    override val provider: WebSocketMessage.Provider = WebSocketMessage.Provider.API

    data class RaisedHandInfo(
        val accountId: String,
        val accountName: String,
        val raisedAt: Long
    )
}

data class WS_ChatMessageResponse(
    val debateId: String,
    val chatId: Long
) : WebSocketMessage {
    override val type: String = "S_CHAT_MESSAGE"
    override val provider: WebSocketMessage.Provider = WebSocketMessage.Provider.API
}

data class WS_SpeakerUpdateResponse(
    val debateId: String,
    val currentSpeaker: CurrentSpeakerInfo?,
    val nextSpeaker: NextSpeakerInfo?
) : WebSocketMessage {
    override val type: String = "S_SPEAKER_UPDATE"
    override val provider: WebSocketMessage.Provider = WebSocketMessage.Provider.API

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

data class WS_DebateRoundUpdateResponse(
    val debateId: String,
    val round: RoundInfo,
    val currentSpeaker: CurrentSpeakerInfo
) : WebSocketMessage {
    override val type: String = "S_DEBATE_ROUND_UPDATE"
    override val provider: WebSocketMessage.Provider = WebSocketMessage.Provider.API

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
package kr.co.booktalk.domain.webSocket

import kr.co.booktalk.WebSocketMessage
import kr.co.booktalk.domain.webSocket.DebateOnlineAccountUpdateResponse.Payload
import java.time.Instant

enum class WebSocketResponseEventType(val value: String) {
    JOIN_SUCCESS("S_JOIN_SUCCESS"),
    JOIN_ERROR("S_JOIN_ERROR"),
    DEBATE_ONLINE_ACCOUNTS_UPDATE("S_DEBATE_ONLINE_ACCOUNTS_UPDATE"),
    HAND_RAISE_UPDATE("S_HAND_RAISE_UPDATE"),
    CHAT_MESSAGE("S_CHAT_MESSAGE"),
    SPEAKER_UPDATE("S_SPEAKER_UPDATE"),
    DEBATE_ROUND_UPDATE("S_DEBATE_ROUND_UPDATE")
}

data class JoinDebateResponse(
    override val payload: Payload
) : WebSocketMessage<JoinDebateResponse.Payload> {
    override val type = WebSocketResponseEventType.JOIN_SUCCESS.value

    data class Payload(
        val debateId: String,
        val accountId: String,
    )

    companion object {
        fun build(debateId: String, accountId: String): JoinDebateResponse {
            return JoinDebateResponse(Payload(debateId, accountId))
        }
    }
}

data class DebateOnlineAccountUpdateResponse(
    override val payload: Payload
) : WebSocketMessage<Payload> {
    override val type = WebSocketResponseEventType.DEBATE_ONLINE_ACCOUNTS_UPDATE.value

    data class Payload(
        val onlineAccountIds: List<String>
    )

    companion object {
        fun build(onlineAccountIds: Set<String>): DebateOnlineAccountUpdateResponse {
            return DebateOnlineAccountUpdateResponse(Payload(onlineAccountIds.toList()))
        }
    }
}

data class HandRaiseResponse(
    override val payload: Payload
) : WebSocketMessage<HandRaiseResponse.Payload> {
    override val type = WebSocketResponseEventType.HAND_RAISE_UPDATE.value

    data class Payload(
        val raisedHandInfoList: List<RaisedHandInfo>
    )

    data class RaisedHandInfo(
        val accountId: String,
        val raisedAt: Instant
    )

    companion object {
        fun build(raisedHandInfoMap: Map<String, Instant>): HandRaiseResponse {
            return HandRaiseResponse(
                Payload(
                    raisedHandInfoMap.map { (accountId, raisedAt) -> RaisedHandInfo(accountId, raisedAt) }
                )
            )
        }
    }
}

data class ChatMessageResponse(
    override val payload: Payload
) : WebSocketMessage<ChatMessageResponse.Payload> {
    override val type = WebSocketResponseEventType.CHAT_MESSAGE.value

    data class Payload(
        val chatId: Long,
        val debateId: String,
        val accountId: String,
        val accountName: String,
        val content: String,
        val createdAt: Instant
    )

    companion object {
        fun build(
            chatId: Long,
            debateId: String,
            accountId: String,
            accountName: String,
            content: String,
            createdAt: Instant
        ): ChatMessageResponse {
            return ChatMessageResponse(
                Payload(
                    chatId = chatId,
                    debateId = debateId,
                    accountId = accountId,
                    accountName = accountName,
                    content = content,
                    createdAt = createdAt
                )
            )
        }
    }
}

data class SpeakerUpdateResponse(
    val debateId: String,
    val currentSpeaker: CurrentSpeakerInfo?,
    val nextSpeaker: NextSpeakerInfo?
) : WebSocketMessage {
    override val type: String = "S_SPEAKER_UPDATE"

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

data class DebateRoundUpdateResponse(
    val debateId: String,
    val round: RoundInfo,
    val currentSpeaker: CurrentSpeakerInfo
) : WebSocketMessage {
    override val type: String = "S_DEBATE_ROUND_UPDATE"

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
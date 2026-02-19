package kr.co.booktalk.domain.aiChat

import kr.co.booktalk.WebSocketMessage
import java.time.Instant

data class CreateAiChatResponse(
    val chatId: String,
)

data class FindOneAiChatResponse(
    val chatId: String,
    val debateId: String,
    val persona: String,
    val member: MemberInfo,
    val messages: List<MessageInfo>,
    val createdAt: Instant,
) {
    data class MemberInfo(
        val accountId: String,
        val accountName: String,
    )

    data class MessageInfo(
        val id: String,
        val role: String,
        val content: String,
        val status: String,
        val createdAt: Instant,
    )
}

data class UserMessageSavedResponse(
    override val payload: Payload
) : WebSocketMessage<UserMessageSavedResponse.Payload>() {
    override val type: String = WSAiChatResponseMessageType.S_USER_MESSAGE_SAVED.name

    data class Payload(
        val chatId: String
    )
}

data class AiChatCompletedResponse(
    override val payload: Payload
) : WebSocketMessage<AiChatCompletedResponse.Payload>() {
    override val type: String = WSAiChatResponseMessageType.S_AI_CHAT_COMPLETED.name

    data class Payload(
        val chatId: String
    )
}

enum class WSAiChatResponseMessageType {
    S_USER_MESSAGE_SAVED,
    S_AI_CHAT_COMPLETED,
}

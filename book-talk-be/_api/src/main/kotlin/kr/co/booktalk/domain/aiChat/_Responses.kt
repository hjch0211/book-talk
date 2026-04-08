package kr.co.booktalk.domain.aiChat

import kr.co.booktalk.WebSocketMessage
import java.time.Instant

data class CreateAiChatResponse(
    val chatId: String,
)

data class FindOneAiChatResponse(
    val chatId: String,
    val debateId: String,
    val personaId: String,
    val agentId: String,
    val member: MemberInfo,
    val debateInfo: DebateInfo,
    val searchResults: SearchResults,
    val messages: List<MessageInfo>,
    val createdAt: Instant,
) {
    data class MemberInfo(
        val accountId: String,
        val accountName: String,
    )

    data class DebateInfo(
        val topic: String,
        val bookTitle: String,
        val bookDescription: String?,
    )

    data class SearchResults(
        val news: List<SearchResultItem>,
        val blog: List<SearchResultItem>,
    )

    data class SearchResultItem(
        val title: String,
        val url: String,
        val content: String,
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

data class ChatSavedResponse(
    override val payload: Payload
) : WebSocketMessage<ChatSavedResponse.Payload>() {
    override val type: String = WSAiChatResponseMessageType.S_CHAT_SAVED.name

    data class Payload(
        val chatId: String
    )
}

enum class WSAiChatResponseMessageType {
    S_USER_MESSAGE_SAVED,
    S_CHAT_SAVED,
}

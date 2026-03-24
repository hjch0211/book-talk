package kr.co.booktalk.domain.aiChat

import kr.co.booktalk.WebSocketMessage

data class CreateAiChatRequest(
    val debateId: String,
    val persona: String,
)

data class SaveChatRequest(
    val chatId: String,
    val message: String,
    val role: String = "user",
    val accountId: String,
)

data class SaveChatWsRequest(
    override val payload: Payload
) : WebSocketMessage<SaveChatWsRequest.Payload>() {
    override val type: String = WSAiChatRequestMessageType.C_SAVE_CHAT.name

    data class Payload(
        val chatId: String,
        val message: String,
        val role: String = "user",
    )
}

enum class WSAiChatRequestMessageType {
    C_HEARTBEAT,
    C_SAVE_CHAT,
}

package kr.co.booktalk.domain.aiChat

import kr.co.booktalk.WebSocketMessage

data class CreateAiChatRequest(
    val debateId: String,
    val persona: String,
)

data class AiChatRequest(
    val chatId: String,
    val message: String,
)

data class AiChatWsRequest(
    override val payload: Payload
) : WebSocketMessage<AiChatWsRequest.Payload>() {
    override val type: String = WSAiChatRequestMessageType.C_AI_CHAT.name

    data class Payload(
        val chatId: String,
        val message: String,
    )
}

enum class WSAiChatRequestMessageType {
    C_HEARTBEAT,
    C_AI_CHAT,
}

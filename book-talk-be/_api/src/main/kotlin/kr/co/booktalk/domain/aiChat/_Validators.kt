package kr.co.booktalk.domain.aiChat

fun CreateAiChatRequest.validate() {
    require(debateId.isNotBlank()) { "토론 ID는 필수입니다." }
    require(persona.isNotBlank()) { "페르소나는 필수입니다." }
}

fun AiChatRequest.validate() {
    require(chatId.isNotBlank()) { "채팅방 ID는 필수입니다." }
    require(message.isNotBlank()) { "메시지는 필수입니다." }
}

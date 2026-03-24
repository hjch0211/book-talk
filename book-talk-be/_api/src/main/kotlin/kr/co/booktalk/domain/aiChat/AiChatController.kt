package kr.co.booktalk.domain.aiChat

import kr.co.booktalk.HttpResult
import kr.co.booktalk.domain.auth.AuthAccount
import kr.co.booktalk.toResult
import org.springframework.web.bind.annotation.*

@RestController
class AiChatController(
    private val aiChatService: AiChatService,
) {
    /** AI 채팅방 생성 */
    @PostMapping("/ai/chats")
    fun createAiChat(@RequestBody request: CreateAiChatRequest, authAccount: AuthAccount): HttpResult<CreateAiChatResponse> {
        request.validate()
        return aiChatService.create(request, authAccount).toResult()
    }

    /** AI 채팅방 조회 */
    @GetMapping("/ai/chats/{chatId}")
    fun findOneAiChat(@PathVariable chatId: String, authAccount: AuthAccount): HttpResult<FindOneAiChatResponse> {
        return aiChatService.findOne(chatId, authAccount).toResult()
    }

    /** AI 채팅방 삭제 */
    @DeleteMapping("/ai/chats/{chatId}")
    fun removeAiChat(@PathVariable chatId: String, authAccount: AuthAccount) {
        aiChatService.remove(chatId)
    }

    /** AI 서버 - 유저 메시지 저장 완료 callback */
    @PostMapping("/ai/chats/{chatId}/user-message-saved")
    fun callbackUserMessageSaved(@PathVariable chatId: String) {
        aiChatService.onUserMessageSaved(chatId)
    }

    /** Agent용 - 채팅 저장 */
    @PostMapping("/ai/chats/agent/message")
    fun saveAgentMessage(@RequestBody request: SaveChatRequest) {
        aiChatService.saveChat(request)
    }
}

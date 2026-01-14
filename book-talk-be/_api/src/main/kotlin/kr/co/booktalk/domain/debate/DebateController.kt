package kr.co.booktalk.domain.debate

import kr.co.booktalk.HttpResult
import kr.co.booktalk.domain.auth.AuthAccount
import kr.co.booktalk.toResult
import org.springframework.web.bind.annotation.*

@RestController
class DebateController(
    private val debateService: DebateService,
    private val debateRoundSpeakerService: DebateRoundSpeakerService,
    private val debateChatService: DebateChatService
) {
    /** 토론 생성 */
    @PostMapping("/debates")
    fun create(@RequestBody request: CreateRequest, authAccount: AuthAccount): HttpResult<CreateResponse> {
        request.validate()
        val response = debateService.create(request, authAccount)
        debateService.summarizeDebate(response.id)
        return response.toResult()
    }

    /** 토론 수정 */
    @PutMapping("/debates")
    fun updateDebate(@RequestBody request: UpdateRequest, authAccount: AuthAccount) {
        request.validate()
        debateService.update(request)
    }

    /** 토론 단건 조회 */
    @GetMapping("/debates/{id}")
    fun findOne(@PathVariable id: String): HttpResult<FindOneResponse> {
        return debateService.findOne(id).toResult()
    }

    /** 토론 참여 */
    @PostMapping("/debates/participants")
    fun join(@RequestBody request: JoinRequest, authAccount: AuthAccount) {
        request.validate()
        debateService.join(request, authAccount)
    }

    /** 발언자 생성 */
    @PostMapping("/debates/round/speakers")
    fun createRoundSpeaker(@RequestBody request: CreateRoundSpeakerRequest, authAccount: AuthAccount) {
        request.validate()
        debateRoundSpeakerService.create(request)
    }

    /** 발언자 업데이트 */
    @PatchMapping("/debates/round/speakers")
    fun patchRoundSpeaker(@RequestBody request: PatchRoundSpeakerRequest, authAccount: AuthAccount) {
        request.validate()
        debateRoundSpeakerService.patch(request)
    }

    /** 채팅 생성 */
    @PostMapping("/debates/round/chats")
    fun createChat(@RequestBody request: CreateChatRequest, authAccount: AuthAccount): HttpResult<CreateChatResponse> {
        request.validate()
        return debateChatService.create(request, authAccount).toResult()
    }

    /** 토론 채팅 조회 */
    @GetMapping("/debates/{debateId}/chats")
    fun getChats(@PathVariable debateId: String, authAccount: AuthAccount): HttpResult<List<ChatResponse>> {
        return debateChatService.findByDebateId(debateId, authAccount).toResult()
    }
}
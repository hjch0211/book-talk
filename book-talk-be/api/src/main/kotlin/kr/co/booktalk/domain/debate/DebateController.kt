package kr.co.booktalk.domain.debate

import kr.co.booktalk.ApiResult
import kr.co.booktalk.cache.AppConfigService
import kr.co.booktalk.domain.auth.AuthAccount
import kr.co.booktalk.toResult
import org.springframework.web.bind.annotation.*

@RestController
class DebateController(
    private val debateService: DebateService,
    private val debateRoundService: DebateRoundService,
    private val appConfigService: AppConfigService,
    private val debateRoundSpeakerService: DebateRoundSpeakerService
) {
    /** 토론 생성 */
    @PostMapping("/debates")
    fun create(@RequestBody request: CreateRequest, authAccount: AuthAccount) {
        request.validate()
        debateService.create(request, authAccount)
    }

    /** 토론 단건 조회 */
    @GetMapping("/debates/{id}")
    fun findOne(@PathVariable id: String, authAccount: AuthAccount): ApiResult<FindOneResponse> {
        return debateService.findOne(id).toResult()
    }

    /** 토론 참여 */
    @PostMapping("/debates/participants")
    fun join(@RequestBody request: JoinRequest, authAccount: AuthAccount) {
        request.validate()
        debateService.join(request, authAccount)
    }

    /** 방장: 토론 라운드 생성(시작) */
    @PostMapping("/debates/round")
    fun createRound(@RequestBody request: CreateRoundRequest, authAccount: AuthAccount) {
        request.validate()
        debateRoundService.create(request, authAccount)
    }

    /** 방장: 토론 라운드 변경 */
    @PatchMapping("/debates/round")
    fun patchRound(@RequestBody request: PatchRoundRequest, authAccount: AuthAccount) {
        request.validate()
        debateRoundService.patch(request, authAccount)
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
}
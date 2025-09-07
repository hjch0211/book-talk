package kr.co.booktalk.domain.debate

import kr.co.booktalk.ApiResult
import kr.co.booktalk.cache.AppConfigService
import kr.co.booktalk.domain.auth.AuthAccount
import kr.co.booktalk.toResult
import org.springframework.web.bind.annotation.*

@RestController
class DebateController(
    private val debateService: DebateService,
    private val appConfigService: AppConfigService
) {
    /** 토론 생성 */
    @PostMapping("/debates")
    fun create(@RequestBody request: CreateRequest, authAccount: AuthAccount) {
        request.validate(
            appConfigService.joinDebateDeadlineSeconds(),
            appConfigService.maxDebateMemberCnt()
        )
        debateService.create(request, authAccount)
    }

    /** 토론 조회 */
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
}
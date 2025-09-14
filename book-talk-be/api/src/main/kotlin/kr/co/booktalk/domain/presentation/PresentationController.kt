package kr.co.booktalk.domain.presentation

import com.github.fge.jsonpatch.JsonPatch
import kr.co.booktalk.ApiResult
import kr.co.booktalk.domain.auth.AuthAccount
import kr.co.booktalk.toResult
import org.springframework.web.bind.annotation.*

@RestController
class PresentationController(
    private val presentationService: PresentationService
) {
    /** 발표 페이지 단건 조회 */
    @GetMapping("/presentations/{id}")
    fun findOne(@PathVariable id: String, authAccount: AuthAccount): ApiResult<FindOneResponse> {
        return presentationService.findOne(id).toResult()
    }

    /** 발표 페이지 최초 생성 */
    @PostMapping("/presentations")
    fun init(@RequestBody request: CreateRequest, authAccount: AuthAccount) {
        request.validate()
        presentationService.init(request, authAccount)
    }

    /** 발표 페이지 내용 수정 */
    @PatchMapping(value = ["/presentations/{id}/content"], consumes = ["application/json-patch+json"])
    fun patchContent(@PathVariable id: String, @RequestBody patch: JsonPatch, authAccount: AuthAccount) {
        presentationService.patchContent(id, patch, authAccount)
    }
}
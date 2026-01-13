package kr.co.booktalk.domain.survey

import kr.co.booktalk.HttpResult
import kr.co.booktalk.domain.auth.AuthAccount
import kr.co.booktalk.toResult
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController

@RestController
class SurveyController(
    private val surveyService: SurveyService,
) {
    /** 설문조사 생성 */
    @PostMapping("/surveys")
    fun create(@RequestBody request: CreateSurveyRequest, authAccount: AuthAccount): HttpResult<CreateSurveyResponse> {
        request.validate()
        return surveyService.create(request, authAccount).toResult()
    }
}
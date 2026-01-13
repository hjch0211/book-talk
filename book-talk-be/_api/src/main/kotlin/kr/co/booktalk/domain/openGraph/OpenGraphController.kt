package kr.co.booktalk.domain.openGraph

import kr.co.booktalk.HttpResult
import kr.co.booktalk.domain.auth.AuthAccount
import kr.co.booktalk.toResult
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.ModelAttribute
import org.springframework.web.bind.annotation.RestController

@RestController
class OpenGraphController(
    private val openGraphService: OpenGraphService
) {
    /** 발표 페이지용 OpenGraph tag 추출 */
    @GetMapping("/presentations/opengraph")
    fun getOGData(
        @ModelAttribute request: FetchOpenGraphRequest,
        authAccount: AuthAccount
    ): HttpResult<FetchOpenGraphResponse> {
        request.validate()
        return openGraphService.getOGData(request.url).toResult()
    }
}
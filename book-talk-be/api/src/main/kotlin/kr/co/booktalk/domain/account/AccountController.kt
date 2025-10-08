package kr.co.booktalk.domain.account

import kr.co.booktalk.ApiResult
import kr.co.booktalk.domain.auth.AuthAccount
import kr.co.booktalk.toResult
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController

@RestController
class AccountController(
    private val accountService: AccountService
) {
    /** 내 계정 정보 조회 */
    @GetMapping("/accounts/me")
    fun findMy(authAccount: AuthAccount): ApiResult<FindMyResponse> {
        return accountService.findMy(authAccount).toResult()
    }

    /** 내 계정 정보 업데이트 */
    @PatchMapping("/accounts/me")
    fun patchMy(authAccount: AuthAccount, @RequestBody request: PatchMyRequest) {
        accountService.patchMy(authAccount, request)
    }
}
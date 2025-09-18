package kr.co.booktalk.domain.account

import kr.co.booktalk.ApiResult
import kr.co.booktalk.domain.auth.AuthAccount
import kr.co.booktalk.toResult
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController

@RestController
class AccountController(
    private val accountService: AccountService
) {
    @GetMapping("/accounts/me")
    fun findMy(authAccount: AuthAccount): ApiResult<FindMyResponse> {
        return accountService.findMy(authAccount).toResult()
    }
}
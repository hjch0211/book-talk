package kr.co.booktalk.domain.account

import kr.co.booktalk.HttpResult
import kr.co.booktalk.domain.auth.AuthAccount
import kr.co.booktalk.toResult
import org.springframework.web.bind.annotation.DeleteMapping
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
    fun findMy(authAccount: AuthAccount): HttpResult<FindMyResponse> {
        return accountService.findMy(authAccount).toResult()
    }

    /** 내 계정 정보 업데이트 */
    @PatchMapping("/accounts/me")
    fun patchMy(authAccount: AuthAccount, @RequestBody request: PatchMyRequest) {
        request.validate()
        accountService.patchMy(authAccount, request)
    }

    /** 비밀번호 변경 */
    @PatchMapping("/accounts/me/password")
    fun patchMyPassword(authAccount: AuthAccount, @RequestBody request: PatchMyPasswordRequest) {
        request.validate()
        accountService.patchMyPassword(authAccount, request)
    }

    /** 회원 탈퇴 (soft delete) */
    @DeleteMapping("/accounts/me")
    fun deleteMyAccount(authAccount: AuthAccount) {
        accountService.archiveMyAccount(authAccount)
    }
}
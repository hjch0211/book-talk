package kr.co.booktalk.domain.auth

import kr.co.booktalk.HttpResult
import kr.co.booktalk.domain.account.AccountService
import kr.co.booktalk.domain.account.UpdateRequest
import kr.co.booktalk.domain.account.toAuthAccount
import kr.co.booktalk.toResult
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController

@RestController
class AuthController(
    private val accountService: AccountService,
    private val authService: AuthService,
) {
    /** 회원가입 */
    @PostMapping("/auth/sign-up")
    fun signUp(@RequestBody request: SignUpRequest): HttpResult<CreateTokensResponse> {
        request.validate()
        val account = accountService.create(request.toAccountCreateRequest())
        val tokens = authService.createTokens(CreateTokensRequest(account.id.toString()))
        accountService.update(account.toAuthAccount(), UpdateRequest(tokens.refreshToken))
        return tokens.toResult()
    }

    /** 중복 접속 확인 */
    @PostMapping("/auth/check")
    fun validateDuplicateSignIn(@RequestBody request: ValidateDuplicateSignInRequest) {
        request.validate()
        val account = runCatching {
            accountService.findByName(request.name)
        }.getOrNull() ?: return
        authService.validateDuplicateSignIn(account)
    }

    /** 로그인 */
    @PostMapping("/auth/sign-in")
    fun signIn(@RequestBody request: SignInRequest): HttpResult<CreateTokensResponse> {
        request.validate()
        val account = accountService.findByName(request.name)
        authService.validateDuplicateSignIn(account)
        val tokens = authService.createTokens(CreateTokensRequest(account.id.toString()))
        accountService.update(account.toAuthAccount(), UpdateRequest(tokens.refreshToken))
        return tokens.toResult()
    }

    /** 로그아웃 */
    @PostMapping("/auth/sign-out")
    fun signOut(authAccount: AuthAccount) {
        accountService.update(authAccount, UpdateRequest(null))
    }

    /** Access Token 재발급 */
    @PostMapping("/auth/refresh")
    fun refresh(authAccount: AuthAccount, @RequestBody request: RefreshRequest): HttpResult<CreateTokensResponse> {
        request.validate()
        val tokens = authService.refresh(request)
        accountService.update(authAccount, UpdateRequest(tokens.refreshToken))
        return tokens.toResult()
    }
}
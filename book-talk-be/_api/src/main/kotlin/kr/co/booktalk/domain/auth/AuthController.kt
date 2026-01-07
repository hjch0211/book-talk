package kr.co.booktalk.domain.auth

import kr.co.booktalk.HttpResult
import kr.co.booktalk.domain.account.AccountService
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
        return authService.createTokens(
            CreateTokensRequest(
                id = account.id.toString(),
            )
        ).toResult()
    }

    /** 로그인 */
    @PostMapping("/auth/sign-in")
    fun signIn(@RequestBody request: SignInRequest): HttpResult<CreateTokensResponse> {
        request.validate()
        val account = accountService.findByName(request.name)
        return authService.createTokens(
            CreateTokensRequest(
                id = account.id.toString(),
            )
        ).toResult()
    }

    /** Access Token 재발급 */
    @PostMapping("/auth/refresh")
    fun refresh(@RequestBody request: RefreshRequest): HttpResult<CreateTokensResponse> {
        request.validate()
        return authService.refresh(request).toResult()
    }
}
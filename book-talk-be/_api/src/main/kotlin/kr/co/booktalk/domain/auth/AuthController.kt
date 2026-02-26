package kr.co.booktalk.domain.auth

import kr.co.booktalk.HttpResult
import kr.co.booktalk.config.AppProperties
import kr.co.booktalk.toResult
import org.springframework.web.bind.annotation.*
import org.springframework.web.servlet.view.RedirectView
import java.net.URLEncoder
import java.nio.charset.StandardCharsets

@RestController
class AuthController(
    private val authService: AuthService,
    private val appProperties: AppProperties,
) {
    /** NORMAL Account - 회원가입 */
    @PostMapping("/auth/sign-up")
    fun signUp(@RequestBody request: SignUpRequest): HttpResult<CreateTokensResponse> {
        request.validate()
        return authService.signUp(request).toResult()
    }

    /** 이메일 인증 코드 발급 */
    @PostMapping("/auth/email/code")
    fun sendEmailCode(@RequestBody request: SendEmailCodeRequest) {
        request.validate()
        authService.sendEmailCode(request)
    }

    /** 이메일 인증 코드 인증 */
    @PostMapping("/auth/email/verify")
    fun verifyEmailCode(@RequestBody request: VerifyEmailCodeRequest) {
        request.validate()
        authService.verifyEmailCode(request)
    }

    /** NORMAL Account - 로그인 */
    @PostMapping("/auth/sign-in")
    fun signIn(@RequestBody request: SignInRequest): HttpResult<CreateTokensResponse> {
        request.validate()
        return authService.signIn(request).toResult()
    }

    /** 로그아웃 */
    @PostMapping("/auth/sign-out")
    fun signOut(authAccount: AuthAccount) {
        authService.signOut(authAccount)
    }

    /** Access Token 재발급 */
    @PostMapping("/auth/refresh")
    fun refresh(@RequestBody request: RefreshRequest): HttpResult<CreateTokensResponse> {
        request.validate()
        return authService.refresh(request).toResult()
    }

    /** Google OAuth 로그인 시작 - Google 인증 서버로 리다이렉트 */
    @GetMapping("/auth/google")
    fun googleLogin(): RedirectView {
        return RedirectView(authService.generateGoogleAuthUrl())
    }

    /** Google OAuth 콜백 */
    @GetMapping("/auth/google/callback")
    fun googleCallback(
        @RequestParam(required = false) code: String?,
        @RequestParam(required = false) error: String?,
        @RequestParam(required = false) state: String?,
    ): RedirectView {
        val frontendBase = "${appProperties.frontendUrl}/auth/callback"
        if (error != null || code == null || state == null) {
            val encodedError = URLEncoder.encode(error ?: "invalid_request", StandardCharsets.UTF_8)
            return RedirectView("$frontendBase?error=$encodedError")
        }
        val userInfo = authService.requestGoogleSignIn(code, state)
        val tokens = authService.saveGoogleAccount(userInfo)
        return RedirectView("$frontendBase?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}")
    }
}
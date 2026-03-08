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

    /** OTP 발급 - 회원가입 */
    @PostMapping("/auth/email/code")
    fun sendSignUpOtp(@RequestBody request: SendSignUpOtpRequest) {
        request.validate()
        authService.sendSignUpOtp(request)
    }

    /** OTP 인증 - 회원가입 */
    @PostMapping("/auth/email/verify")
    fun verifySignUpOtp(@RequestBody request: VerifySignUpOtpRequest) {
        request.validate()
        authService.verifySignUpOtp(request)
    }

    /** OTP 발급 - 비밀번호 재설정 */
    @PostMapping("/auth/password/reset/code")
    fun sendPasswordResetOtp(@RequestBody request: SendPasswordResetOtpRequest) {
        request.validate()
        authService.sendPasswordResetOtp(request)
    }

    /** OTP 인증 - 비밀번호 재설정 */
    @PostMapping("/auth/password/reset/verify")
    fun verifyPasswordResetOtp(@RequestBody request: VerifyPasswordResetOtpRequest) {
        request.validate()
        authService.verifyPasswordResetOtp(request)
    }

    /** 비밀번호 재설정 */
    @PostMapping("/auth/password/reset")
    fun resetPassword(@RequestBody request: ResetPasswordRequest) {
        request.validate()
        authService.resetPassword(request)
    }

    /** NORMAL Account - 로그인 */
    @PostMapping("/auth/sign-in")
    fun signIn(@RequestBody request: SignInRequest): HttpResult<CreateTokensResponse> {
        request.validate()
        return authService.signIn(request).toResult()
    }

    /** 비밀번호 검증 */
    @PostMapping("/auth/verify-password")
    fun verifyPassword(authAccount: AuthAccount, @RequestBody request: VerifyPasswordRequest) {
        request.validate()
        authService.verifyPassword(authAccount, request)
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
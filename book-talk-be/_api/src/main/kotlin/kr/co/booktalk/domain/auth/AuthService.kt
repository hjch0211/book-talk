package kr.co.booktalk.domain.auth

import kotlinx.coroutines.runBlocking
import kr.co.booktalk.*
import kr.co.booktalk.cache.GoogleOAuthStateCache
import kr.co.booktalk.cache.PasswordResetOtpCache
import kr.co.booktalk.cache.SignUpOtpCache
import kr.co.booktalk.client.GoogleAuthClient
import kr.co.booktalk.client.GoogleUserInfo
import kr.co.booktalk.client.MailClient
import kr.co.booktalk.client.MonitorClient
import kr.co.booktalk.client.SendMailRequest
import kr.co.booktalk.client.SendRequest
import kr.co.booktalk.config.LibProperties
import kr.co.booktalk.domain.AccountEntity
import kr.co.booktalk.domain.AccountRepository
import kr.co.booktalk.domain.DefaultNicknameRepository
import kr.co.booktalk.domain.Provider
import java.time.Instant
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.net.URLEncoder
import java.nio.charset.StandardCharsets

@Service
class AuthService(
    private val jwtService: JwtService,
    private val mailClient: MailClient,
    private val signUpOtpCache: SignUpOtpCache,
    private val passwordResetOtpCache: PasswordResetOtpCache,
    private val googleStateCache: GoogleOAuthStateCache,
    private val accountRepository: AccountRepository,
    private val defaultNicknameRepository: DefaultNicknameRepository,
    private val googleAuthClient: GoogleAuthClient,
    private val libProperties: LibProperties,
    private val monitorClient: MonitorClient,
) {
    @Transactional
    fun signUp(request: SignUpRequest): CreateTokensResponse {
        if (!signUpOtpCache.isVerified(request.email)) httpBadRequest("이메일 인증이 완료되지 않았거나 만료되었습니다.")
        if (accountRepository.existsByName(request.name)) httpBadRequest("이미 사용 중인 이름입니다.")

        val existingAccount = accountRepository.findByEmailWithArchived(request.email)
        val account = when {
            existingAccount != null && existingAccount.archivedAt == null -> {
                if (existingAccount.password != null) httpBadRequest("이미 존재하는 계정입니다.")
                existingAccount.name = request.name
                existingAccount.password = request.password.bcrypt()
                existingAccount
            }
            existingAccount != null -> {
                existingAccount.archivedAt = null
                existingAccount.provider = null
                existingAccount.name = request.name
                existingAccount.password = request.password.bcrypt()
                existingAccount
            }
            else -> {
                accountRepository.save(
                    AccountEntity(
                        provider = null,
                        email = request.email,
                        name = request.name,
                        password = request.password.bcrypt(),
                    )
                ).also {
                    runBlocking {
                        monitorClient.send(
                            SendRequest(
                                title = "신규 유저 가입",
                                message = "이메일: ${request.email}, 이름: ${request.name}",
                                stackTrace = "",
                                level = SendRequest.Level.INFO,
                            )
                        )
                    }
                }
            }
        }

        val tokens = createTokens(account.id.toString())
        account.refreshToken = tokens.refreshToken
        signUpOtpCache.delete(request.email)
        return tokens
    }

    fun sendSignUpOtp(request: SendSignUpOtpRequest) {
        val code = generateCode()
        signUpOtpCache.set(request.email, code)
        mailClient.send(
            SendMailRequest(
                to = request.email,
                subject = "[BookTalk] 이메일 인증 코드",
                html = "<!DOCTYPE html><html lang=\"ko\"><head><meta charset=\"UTF-8\"><title>인증 코드 안내</title></head><body style=\"margin:0;padding:0;background-color:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;\"><table role=\"presentation\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" style=\"padding:24px 0;\"><tr><td align=\"center\"><table role=\"presentation\" width=\"480\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" style=\"max-width:480px;background-color:#ffffff;border-radius:8px;box-shadow:0 6px 18px rgba(0,0,0,.06);padding:32px 28px 28px;\"><tr><td align=\"center\" style=\"padding:0 0 16px 0;\"><h1 style=\"margin:0;font-size:20px;font-weight:700;color:#111827;\">인증 코드를 입력해 주세요</h1></td></tr><tr><td align=\"center\" style=\"padding:0 0 24px 0;\"><p style=\"margin:0;font-size:14px;line-height:1.6;color:#4b5563;\">아래 인증 코드를 화면에 보이는 입력창에 그대로 입력해 주세요.</p></td></tr><tr><td align=\"center\" style=\"padding:0 0 16px 0;\"><div style=\"margin:0 auto;max-width:260px;padding:16px 20px;background-color:#f9fafb;border-radius:999px;border:1px solid #e5e7eb;text-align:center;letter-spacing:.32em;font-size:24px;font-weight:700;color:#111827;\">$code</div></td></tr><tr><td align=\"center\" style=\"padding:0 0 8px 0;\"><p style=\"margin:0;font-size:13px;color:#9ca3af;\">이 코드는 발급 시점 기준 5분 동안만 유효합니다.</p></td></tr><tr><td align=\"center\"><p style=\"margin:0;font-size:12px;color:#9ca3af;\">본인이 요청한 인증이 아니라면, 이 메일을 무시하셔도 됩니다.</p></td></tr></table></td></tr></table></body></html>",
            )
        )
    }

    fun verifySignUpOtp(request: VerifySignUpOtpRequest) {
        if (!signUpOtpCache.verify(request.email, request.code)) httpBadRequest("인증 코드가 일치하지 않습니다.")
    }

    fun sendPasswordResetOtp(request: SendPasswordResetOtpRequest) {
        val account = accountRepository.findByEmail(request.email) ?: httpBadRequest("존재하지 않는 계정입니다.")
        if (account.password == null) httpBadRequest("이메일/비밀번호로 가입한 계정이 아닙니다.")
        val code = generateCode()
        passwordResetOtpCache.set(request.email, code)
        mailClient.send(
            SendMailRequest(
                to = request.email,
                subject = "[BookTalk] 비밀번호 재설정 인증 코드",
                html = "<!DOCTYPE html><html lang=\"ko\"><head><meta charset=\"UTF-8\"><title>비밀번호 재설정 인증 코드</title></head><body style=\"margin:0;padding:0;background-color:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;\"><table role=\"presentation\" width=\"100%\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" style=\"padding:24px 0;\"><tr><td align=\"center\"><table role=\"presentation\" width=\"480\" cellspacing=\"0\" cellpadding=\"0\" border=\"0\" style=\"max-width:480px;background-color:#ffffff;border-radius:8px;box-shadow:0 6px 18px rgba(0,0,0,.06);padding:32px 28px 28px;\"><tr><td align=\"center\" style=\"padding:0 0 16px 0;\"><h1 style=\"margin:0;font-size:20px;font-weight:700;color:#111827;\">비밀번호 재설정 인증 코드</h1></td></tr><tr><td align=\"center\" style=\"padding:0 0 24px 0;\"><p style=\"margin:0;font-size:14px;line-height:1.6;color:#4b5563;\">아래 인증 코드를 입력해 비밀번호를 재설정해 주세요.</p></td></tr><tr><td align=\"center\" style=\"padding:0 0 16px 0;\"><div style=\"margin:0 auto;max-width:260px;padding:16px 20px;background-color:#f9fafb;border-radius:999px;border:1px solid #e5e7eb;text-align:center;letter-spacing:.32em;font-size:24px;font-weight:700;color:#111827;\">$code</div></td></tr><tr><td align=\"center\" style=\"padding:0 0 8px 0;\"><p style=\"margin:0;font-size:13px;color:#9ca3af;\">이 코드는 발급 시점 기준 5분 동안만 유효합니다.</p></td></tr><tr><td align=\"center\"><p style=\"margin:0;font-size:12px;color:#9ca3af;\">본인이 요청한 인증이 아니라면, 이 메일을 무시하셔도 됩니다.</p></td></tr></table></td></tr></table></body></html>",
            )
        )
    }

    fun verifyPasswordResetOtp(request: VerifyPasswordResetOtpRequest) {
        if (!passwordResetOtpCache.verify(request.email, request.code)) httpBadRequest("인증 코드가 일치하지 않습니다.")
    }

    @Transactional
    fun resetPassword(request: ResetPasswordRequest) {
        if (!passwordResetOtpCache.isVerified(request.email)) httpBadRequest("이메일 인증이 완료되지 않았거나 만료되었습니다.")
        val account = accountRepository.findByEmail(request.email) ?: httpBadRequest("존재하지 않는 계정입니다.")
        if (account.password == null) httpBadRequest("이메일/비밀번호로 가입한 계정이 아닙니다.")
        account.password = request.newPassword.bcrypt()
        passwordResetOtpCache.delete(request.email)
    }

    @Transactional
    fun signIn(request: SignInRequest): CreateTokensResponse {
        val account = accountRepository.findByEmail(request.email) ?: httpBadRequest("존재하지 않는 계정입니다.")
        val password = account.password ?: httpBadRequest("이메일/비밀번호로 로그인할 수 없는 계정입니다.")
        if (!request.password.matchesBcrypt(password)) httpBadRequest("비밀번호가 일치하지 않습니다.")

        val tokens = createTokens(account.id.toString())
        account.refreshToken = tokens.refreshToken
        return tokens
    }

    @Transactional(readOnly = true)
    fun verifyPassword(authAccount: AuthAccount, request: VerifyPasswordRequest) {
        val account = accountRepository.findByIdOrNull(authAccount.id.toUUID()) ?: httpBadRequest("존재하지 않는 계정입니다.")
        val password = account.password ?: httpBadRequest("소셜 로그인 계정은 비밀번호를 사용하지 않습니다.")
        if (!request.password.matchesBcrypt(password)) httpBadRequest("비밀번호가 일치하지 않습니다.")
    }

    @Transactional
    fun signOut(authAccount: AuthAccount) {
        val account = accountRepository.findByIdOrNull(authAccount.id.toUUID()) ?: httpBadRequest("존재하지 않는 계정입니다.")
        account.refreshToken = null
    }

    @Transactional
    fun refresh(request: RefreshRequest): CreateTokensResponse {
        jwtService.validateRefresh(request.refreshToken)
        val account = accountRepository.findByRefreshToken(request.refreshToken)
            ?: httpBadRequest("존재하지 않는 계정입니다.")
        val tokens = createTokens(account.id.toString())
        account.refreshToken = tokens.refreshToken
        return tokens
    }

    fun generateGoogleAuthUrl(): String {
        val state = googleStateCache.generate()
        val encodedRedirectUri = URLEncoder.encode(libProperties.google.redirectUri, StandardCharsets.UTF_8)
        return "https://accounts.google.com/o/oauth2/v2/auth" +
                "?client_id=${libProperties.google.clientId}" +
                "&redirect_uri=$encodedRedirectUri" +
                "&response_type=code" +
                "&scope=openid%20email" +
                "&state=$state"
    }

    fun requestGoogleSignIn(code: String, state: String): GoogleUserInfo {
        if (!googleStateCache.validateAndDelete(state)) httpBadRequest("유효하지 않은 요청입니다.")
        return runBlocking { googleAuthClient.exchangeCode(code) }
    }

    @Transactional
    fun saveGoogleAccount(userInfo: GoogleUserInfo): CreateTokensResponse {
        val existing = accountRepository.findByEmailWithArchived(userInfo.email)
        val account = when {
            existing != null && existing.archivedAt == null -> existing
            existing != null -> {
                existing.name = generateUniqueName()
                existing.archivedAt = null
                existing.provider = Provider.GOOGLE
                existing
            }
            else -> accountRepository.save(
                AccountEntity(
                    provider = Provider.GOOGLE,
                    email = userInfo.email,
                    name = generateUniqueName(),
                )
            ).also {
                runBlocking {
                    monitorClient.send(
                        SendRequest(
                            title = "신규 유저 가입 (Google)",
                            message = "이메일: ${userInfo.email}, 이름: ${it.name}",
                            stackTrace = "",
                            level = SendRequest.Level.INFO,
                        )
                    )
                }
            }
        }

        account.provider = Provider.GOOGLE

        val tokens = createTokens(account.id.toString())
        account.refreshToken = tokens.refreshToken
        return tokens
    }

    private fun generateUniqueName(): String {
        val nickname = defaultNicknameRepository.findRandomAvailable()
            ?: error("사용 가능한 닉네임이 없습니다.")
        nickname.archivedAt = Instant.now()
        return "${nickname.name} %03d".format(nickname.num)
    }

    private fun createTokens(id: String): CreateTokensResponse {
        val accessToken = jwtService.generateAccessToken(id)
        val refreshToken = jwtService.generateRefreshToken(id)
        return CreateTokensResponse(accessToken, refreshToken)
    }
}

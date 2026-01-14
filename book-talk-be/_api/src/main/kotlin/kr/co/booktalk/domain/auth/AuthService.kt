package kr.co.booktalk.domain.auth

import kr.co.booktalk.domain.AccountEntity
import kr.co.booktalk.domain.AccountRepository
import kr.co.booktalk.httpUnauthenticated
import org.springframework.stereotype.Service

@Service
class AuthService(
    private val jwtService: JwtService,
) {
    fun createTokens(request: CreateTokensRequest): CreateTokensResponse {
        val accessToken = jwtService.generateAccessToken(request.id)
        val refreshToken = jwtService.generateRefreshToken(request.id)
        return CreateTokensResponse(accessToken, refreshToken)
    }

    fun validateDuplicateSignIn(account: AccountEntity) {
        if(account.refreshToken == null) return

        runCatching {
            jwtService.validateRefresh(account.refreshToken!!)
        }.onSuccess {
            httpUnauthenticated("이미 접속한 닉네임이 있습니다. 다른 닉네임으로 시도하세요.")
        }
    }

    fun refresh(request: RefreshRequest): CreateTokensResponse {
        val decoded = jwtService.decodeRefresh(request.refreshToken)
        return createTokens(CreateTokensRequest(decoded.subject))
    }
}
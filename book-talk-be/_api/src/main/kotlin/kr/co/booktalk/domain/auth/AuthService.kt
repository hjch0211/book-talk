package kr.co.booktalk.domain.auth

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

    fun refresh(request: RefreshRequest): CreateTokensResponse {
        val decoded = jwtService.decodeRefresh(request.refreshToken)
        return createTokens(CreateTokensRequest(decoded.subject))
    }
}
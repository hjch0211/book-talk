package kr.co.booktalk.domain.auth

import com.auth0.jwt.JWT
import com.auth0.jwt.interfaces.DecodedJWT
import com.auth0.jwt.interfaces.JWTVerifier
import kr.co.booktalk.config.JWTAlgorithmFactory
import kr.co.booktalk.config.LibProperties
import kr.co.booktalk.httpUnauthenticated
import org.springframework.stereotype.Service
import java.time.Instant

@Service
class JwtService(
    private val properties: LibProperties,
    jwtAlgorithmFactory: JWTAlgorithmFactory,
) {
    private val accessAlgorithm = jwtAlgorithmFactory.createAccessAlgorithm()
    private val refreshAlgorithm = jwtAlgorithmFactory.createRefreshAlgorithm()

    fun generateAccessToken(id: String): String {
        val now = Instant.now()
        return JWT.create()
            .withIssuer(properties.jwt.access.issuer)
            .withSubject(id)
            .withAudience(properties.jwt.access.audience)
            .withIssuedAt(now)
            .withExpiresAt(now.plus(properties.jwt.access.expiringTime))
            .withClaim("type", "access")
            .sign(accessAlgorithm)
    }

    fun generateRefreshToken(id: String): String {
        val now = Instant.now()
        return JWT.create()
            .withIssuer(properties.jwt.refresh.issuer)
            .withSubject(id)
            .withAudience(properties.jwt.refresh.audience)
            .withIssuedAt(now)
            .withExpiresAt(now.plus(properties.jwt.refresh.expiringTime))
            .withClaim("type", "refresh")
            .sign(refreshAlgorithm)
    }

    fun decodeAccess(token: String): DecodedJWT {
        validateAccess(token)
        return JWT.decode(token)
    }

    fun decodeRefresh(token: String): DecodedJWT {
        return JWT.decode(token)
    }

    fun validateAccess(token: String): DecodedJWT {
        val verifier: JWTVerifier = JWT.require(accessAlgorithm)
            .withIssuer(properties.jwt.access.issuer)
            .build()
        return try {
            verifier.verify(token)
        } catch (e: Exception) {
            httpUnauthenticated("유효하지 않는 토큰입니다.")
        }
    }

    fun validateRefresh(token: String): DecodedJWT {
        val verifier: JWTVerifier = JWT.require(refreshAlgorithm)
            .withIssuer(properties.jwt.refresh.issuer)
            .build()
        return try {
            verifier.verify(token)
        } catch (e: Exception) {
            httpUnauthenticated("유효하지 않는 토큰입니다.")
        }
    }
}
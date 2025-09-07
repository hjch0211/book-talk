package kr.co.booktalk.config

import com.auth0.jwt.algorithms.Algorithm
import org.springframework.stereotype.Component

@Component
class JWTAlgorithmFactory(
    private val properties: LibProperties
) {
    fun createAccessAlgorithm(): Algorithm {
        return Algorithm.HMAC256(properties.jwt.access.secret)
    }

    fun createRefreshAlgorithm(): Algorithm {
        return Algorithm.HMAC256(properties.jwt.refresh.secret)
    }
}
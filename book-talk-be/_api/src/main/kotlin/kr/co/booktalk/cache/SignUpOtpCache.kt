package kr.co.booktalk.cache

import org.springframework.stereotype.Component
import java.time.Duration

/** 회원가입 OTP cache (email: code, email: isVerified) */
@Component
class SignUpOtpCache(private val cacheClient: CacheClient) {
    companion object {
        private const val PREFIX = "otp:signup:"
        private val TTL: Duration = Duration.ofMinutes(5)
    }

    fun set(email: String, code: String) {
        cacheClient.set(codeKey(email), code, TTL)
        cacheClient.delete(verifiedKey(email))
    }

    fun delete(email: String) {
        cacheClient.delete(codeKey(email))
        cacheClient.delete(verifiedKey(email))
    }

    fun verify(email: String, code: String): Boolean {
        if (cacheClient.get(codeKey(email)) != code) return false
        cacheClient.set(verifiedKey(email), "true", TTL)
        return true
    }

    fun isVerified(email: String): Boolean {
        return cacheClient.exists(verifiedKey(email))
    }

    private fun codeKey(email: String): String = "$PREFIX$email"
    private fun verifiedKey(email: String): String = "$PREFIX$email:verified"
}
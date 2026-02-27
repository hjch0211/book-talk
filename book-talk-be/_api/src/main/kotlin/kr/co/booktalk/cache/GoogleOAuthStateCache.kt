package kr.co.booktalk.cache

import org.springframework.stereotype.Component
import java.time.Duration
import java.util.*

/** Google OAuth 2.0 state 파라미터 캐시 (CSRF 방어) - (id: validated) */
@Component
class GoogleOAuthStateCache(private val cacheClient: CacheClient) {
    companion object {
        private const val PREFIX = "google:oauth:state:"
        private val TTL = Duration.ofMinutes(5)
    }

    fun generate(): String {
        val state = UUID.randomUUID().toString()
        cacheClient.set("$PREFIX$state", "1", TTL)
        return state
    }

    fun validateAndDelete(state: String): Boolean {
        val exists = cacheClient.exists("$PREFIX$state")
        if (exists) cacheClient.delete("$PREFIX$state")
        return exists
    }
}
package kr.co.booktalk.cache

import org.springframework.stereotype.Component
import java.time.Duration
import java.time.Instant

/** 손들기 상태 cache (debateId.accountId : raisedAt(UTC)) */
@Component
class HandRaiseCache(
    private val cacheClient: CacheClient
) {
    companion object {
        private const val PREFIX = "debate:hands:"
        private val TTL: Duration = Duration.ofSeconds(5)
    }

    fun get(debateId: String, accountId: String): Instant? {
        return cacheClient.get(key(debateId, accountId))?.let { runCatching { Instant.parse(it) }.getOrNull() }
    }

    fun add(debateId: String, accountId: String, raisedAt: Instant) {
        cacheClient.set(key(debateId, accountId), raisedAt.toString(), TTL)
    }

    fun remove(debateId: String, accountId: String) {
        cacheClient.delete(key(debateId, accountId))
    }

    private fun key(debateId: String, accountId: String): String =
        "$PREFIX$debateId.$accountId"
}
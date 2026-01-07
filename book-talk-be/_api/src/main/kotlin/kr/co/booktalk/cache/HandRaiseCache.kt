package kr.co.booktalk.cache

import org.springframework.stereotype.Component
import java.time.Duration
import java.time.Instant

/** 손들기 상태 cache (debateId: Map<accountId, raisedAt>) */
@Component
class HandRaiseCache(
    private val cacheClient: CacheClient
) {
    companion object {
        private const val PREFIX = "debate:hands:"
        private val TTL: Duration = Duration.ofSeconds(5)
    }

    fun add(debateId: String, accountId: String, raisedAt: Instant = Instant.now()) {
        val key = key(debateId)
        cacheClient.setToHash(key, accountId, raisedAt.toEpochMilli().toString())
        cacheClient.expire(key, TTL)
    }

    fun remove(debateId: String, accountId: String) {
        cacheClient.deleteHash(key(debateId), accountId)
    }

    fun get(debateId: String): Map<String, Instant> {
        return cacheClient.getAllFromHash(key(debateId))
            .mapValues { Instant.ofEpochMilli(it.value.toLong()) }
    }

    private fun key(debateId: String): String =
        PREFIX + debateId
}

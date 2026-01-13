package kr.co.booktalk.cache

import org.springframework.stereotype.Component
import java.time.Duration

/** 현재 토론방의 접속중인 account cache (debateId: Set<accountId>) */
@Component
class DebateOnlineAccountsCache(private val cacheClient: CacheClient) {
    companion object {
        private const val PREFIX = "debate:online_accounts:"
        private val TTL: Duration = Duration.ofDays(1)
    }

    fun add(debateId: String, accountId: String) {
        val key = key(debateId)
        cacheClient.addToSet(key, accountId, TTL)
    }

    fun remove(debateId: String, accountId: String) {
        cacheClient.deleteFromSet(key(debateId), accountId)
    }

    fun get(debateId: String): Set<String> {
        return cacheClient.getFromSet(key(debateId))
    }

    private fun key(debateId: String): String =
        PREFIX + debateId
}
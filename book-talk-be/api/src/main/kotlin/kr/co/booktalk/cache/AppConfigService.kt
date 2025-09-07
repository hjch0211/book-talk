package kr.co.booktalk.cache

import io.github.oshai.kotlinlogging.KotlinLogging
import kr.co.booktalk.domain.AppConfigRepository
import kr.co.booktalk.httpInternalServerError
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import java.time.Instant
import java.util.concurrent.ConcurrentHashMap

/** 메모리 캐시를 이용한 AppConfig */
@Service
class AppConfigService(
    private val repository: AppConfigRepository
) {
    private val logger = KotlinLogging.logger {}
    private val cache = ConcurrentHashMap<String, CacheEntry>()

    /** 토론 참여 가능 시간 (startedAt - joinDebateDeadlineSeconds) */
    fun joinDebateDeadlineSeconds(): Long {
        return findByKey("joinDebateDeadlineSeconds").toLong()
    }

    /** 토론 최대 참여자수 */
    fun maxDebateMemberCnt(): Long {
        return findByKey("maxDebateMemberCnt").toLong()
    }

    fun findByKey(key: String): String {
        val now = Instant.now()
        val cachedEntry = cache[key]

        if (cachedEntry != null && !cachedEntry.isExpired(now)) {
            return cachedEntry.value
        }

        return repository.findByIdOrNull(key)?.let { entity ->
            cache[key] = CacheEntry(entity.value, now, entity.cacheSeconds)
            entity.value
        } ?: run {
            logger.error { "유효하지 않은 app config key입니다. - key: $key" }
            httpInternalServerError()
        }
    }
}

private data class CacheEntry(
    val value: String,
    val cachedAt: Instant,
    val cacheSeconds: Long?
) {
    fun isExpired(now: Instant): Boolean {
        return cacheSeconds?.let {
            now.isAfter(cachedAt.plusSeconds(it))
        } ?: false
    }
}
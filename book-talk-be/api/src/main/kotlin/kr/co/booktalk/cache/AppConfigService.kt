package kr.co.booktalk.cache

import io.github.oshai.kotlinlogging.KotlinLogging
import kr.co.booktalk.domain.AppConfigRepository
import kr.co.booktalk.httpInternalServerError
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import java.time.Duration

/** Redis 캐시를 이용한 AppConfig */
@Service
class AppConfigService(
    private val repository: AppConfigRepository,
    private val cacheClient: CacheClient
) {
    private val logger = KotlinLogging.logger {}

    companion object {
        private const val CACHE_PREFIX = "app_config:"
    }

    /** 토론 참여 가능 시간 (startedAt - joinDebateDeadlineSeconds) */
    fun joinDebateDeadlineSeconds(): Long {
        return findByKey("joinDebateDeadlineSeconds").toLong()
    }

    /** 토론 최대 참여자수 */
    fun maxDebateMemberCnt(): Long {
        return findByKey("maxDebateMemberCnt").toLong()
    }

    /** 토론 라운드 발언자 발언 시간(초) */
    fun debateRoundSpeakerSeconds(): Long {
        return findByKey("debateRoundSpeakerSeconds").toLong()
    }

    fun findByKey(key: String): String {
        val cacheKey = CACHE_PREFIX + key

        // Redis에서 캐시 조회
        cacheClient.get(cacheKey)?.let { cachedValue ->
            return cachedValue
        }

        // 캐시 미스시 DB에서 조회
        return repository.findByIdOrNull(key)?.let { entity ->
            val ttl = entity.cacheSeconds?.let { Duration.ofSeconds(it) }
            cacheClient.set(cacheKey, entity.value, ttl)
            entity.value
        } ?: run {
            logger.error { "유효하지 않은 app config key입니다. - key: $key" }
            httpInternalServerError()
        }
    }
}
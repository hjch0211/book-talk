package kr.co.booktalk.cache

import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.data.redis.core.RedisTemplate
import java.time.Duration

interface CacheClient {
    fun get(key: String): String?
    fun set(key: String, value: String, ttl: Duration? = null)
    fun delete(key: String)
    fun exists(key: String): Boolean

    /** Set 연산 */
    fun addToSet(key: String, value: String, ttl: Duration? = null)
    fun removeFromSet(key: String, value: String)
    fun getSetMembers(key: String): Set<String>
    fun expire(key: String, ttl: Duration)

    /** Hash 연산 */
    fun setToHash(key: String, field: String, value: String)
    fun setAllToHash(key: String, map: Map<String, String>, ttl: Duration? = null)
    fun getFromHash(key: String, field: String): String?
    fun getAllFromHash(key: String): Map<String, String>
    fun deleteHash(key: String, field: String)
}

class RedisCacheClient(
    private val redisTemplate: RedisTemplate<String, String>
) : CacheClient {
    private val logger = KotlinLogging.logger {}

    override fun get(key: String): String? {
        return try {
            redisTemplate.opsForValue().get(key)
        } catch (e: Exception) {
            logger.warn(e) { "Redis get 실패 - key: $key" }
            null
        }
    }

    override fun set(key: String, value: String, ttl: Duration?) {
        if (ttl != null) {
            redisTemplate.opsForValue().set(key, value, ttl)
        } else {
            redisTemplate.opsForValue().set(key, value)
        }
    }

    override fun delete(key: String) {
        redisTemplate.delete(key)
    }

    override fun exists(key: String): Boolean {
        return try {
            redisTemplate.hasKey(key) == true
        } catch (e: Exception) {
            logger.warn(e) { "Redis exists 실패 - key: $key" }
            false
        }
    }

    override fun addToSet(key: String, value: String, ttl: Duration?) {
        redisTemplate.opsForSet().add(key, value)
        ttl?.let { redisTemplate.expire(key, it) }
    }

    override fun removeFromSet(key: String, value: String) {
        redisTemplate.opsForSet().remove(key, value)
    }

    override fun getSetMembers(key: String): Set<String> {
        return try {
            redisTemplate.opsForSet().members(key) ?: emptySet()
        } catch (e: Exception) {
            logger.warn(e) { "Redis getSetMembers 실패 - key: $key" }
            emptySet()
        }
    }

    override fun expire(key: String, ttl: Duration) {
        redisTemplate.expire(key, ttl)
    }

    override fun setToHash(key: String, field: String, value: String) {
        redisTemplate.opsForHash<String, String>().put(key, field, value)
    }

    override fun setAllToHash(key: String, map: Map<String, String>, ttl: Duration?) {
        redisTemplate.opsForHash<String, String>().putAll(key, map)
        ttl?.let { redisTemplate.expire(key, it) }
    }

    override fun getFromHash(key: String, field: String): String? {
        return try {
            redisTemplate.opsForHash<String, String>().get(key, field)
        } catch (e: Exception) {
            logger.warn(e) { "Redis hashGet 실패 - key: $key, field: $field" }
            null
        }
    }

    override fun getAllFromHash(key: String): Map<String, String> {
        return try {
            redisTemplate.opsForHash<String, String>().entries(key)
        } catch (e: Exception) {
            logger.warn(e) { "Redis hashGetAll 실패 - key: $key" }
            emptyMap()
        }
    }

    override fun deleteHash(key: String, field: String) {
        try {
            redisTemplate.opsForHash<String, String>().delete(key, field)
        } catch (e: Exception) {
            logger.warn(e) { "Redis hashDelete 실패 - key: $key, field: $field" }
        }
    }
}

class NoOpCacheClient : CacheClient {
    private val logger = KotlinLogging.logger {}

    override fun get(key: String): String? {
        logger.warn { "[NoOp] get - key: $key" }
        return null
    }

    override fun set(key: String, value: String, ttl: Duration?) {
        logger.warn { "[NoOp] set - key: $key, ttl: $ttl" }
    }

    override fun delete(key: String) {
        logger.warn { "[NoOp] delete - key: $key" }
    }

    override fun exists(key: String): Boolean {
        logger.warn { "[NoOp] exists - key: $key" }
        return false
    }

    override fun addToSet(key: String, value: String, ttl: Duration?) {
        logger.warn { "[NoOp] addToSet - key: $key, value: $value, ttl: $ttl" }
    }

    override fun removeFromSet(key: String, value: String) {
        logger.warn { "[NoOp] removeFromSet - key: $key, value: $value" }
    }

    override fun getSetMembers(key: String): Set<String> {
        logger.warn { "[NoOp] getSetMembers - key: $key" }
        return emptySet()
    }

    override fun expire(key: String, ttl: Duration) {
        logger.warn { "[NoOp] expire - key: $key, ttl: $ttl" }
    }

    override fun setToHash(key: String, field: String, value: String) {
        logger.warn { "[NoOp] hashSet - key: $key, field: $field" }
    }

    override fun setAllToHash(key: String, map: Map<String, String>, ttl: Duration?) {
        logger.warn { "[NoOp] hashSetAll - key: $key, size: ${map.size}, ttl: $ttl" }
    }

    override fun getFromHash(key: String, field: String): String? {
        logger.warn { "[NoOp] hashGet - key: $key, field: $field" }
        return null
    }

    override fun getAllFromHash(key: String): Map<String, String> {
        logger.warn { "[NoOp] hashGetAll - key: $key" }
        return emptyMap()
    }

    override fun deleteHash(key: String, field: String) {
        logger.warn { "[NoOp] hashDelete - key: $key, field: $field" }
    }
}
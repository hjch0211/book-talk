package kr.co.booktalk.cache

import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.data.redis.core.RedisTemplate
import org.springframework.data.redis.core.script.DefaultRedisScript
import java.time.Duration

interface CacheClient {
    fun get(key: String): String?
    fun set(key: String, value: String, ttl: Duration)
    fun delete(key: String)
    fun exists(key: String): Boolean

    /** Set 연산 */
    fun getFromSet(key: String): Set<String>
    fun addToSet(key: String, value: String, ttl: Duration)
    fun deleteFromSet(key: String, value: String)
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

    override fun set(key: String, value: String, ttl: Duration) {
        redisTemplate.opsForValue().set(key, value, ttl)
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

    override fun getFromSet(key: String): Set<String> {
        return try {
            redisTemplate.opsForSet().members(key) ?: emptySet()
        } catch (e: Exception) {
            logger.warn(e) { "Redis getSetMembers 실패 - key: $key" }
            emptySet()
        }
    }

    override fun addToSet(key: String, value: String, ttl: Duration) {
        redisTemplate.execute(
            DefaultRedisScript<Long>().apply {
                setScriptText(
                    """
                    redis.call('SADD', KEYS[1], ARGV[1])
                    redis.call('EXPIRE', KEYS[1], ARGV[2])
                    return 1
                    """.trimIndent()
                )
                resultType = Long::class.java
            },
            listOf(key),
            value,
            ttl.seconds.toString()
        )
    }

    override fun deleteFromSet(key: String, value: String) {
        redisTemplate.opsForSet().remove(key, value)
    }
}

class NoOpCacheClient : CacheClient {
    private val logger = KotlinLogging.logger {}

    override fun get(key: String): String? {
        logger.warn { "[NoOp] get - key: $key" }
        return null
    }

    override fun set(key: String, value: String, ttl: Duration) {
        logger.warn { "[NoOp] set - key: $key, ttl: $ttl" }
    }

    override fun delete(key: String) {
        logger.warn { "[NoOp] delete - key: $key" }
    }

    override fun exists(key: String): Boolean {
        logger.warn { "[NoOp] exists - key: $key" }
        return false
    }

    override fun getFromSet(key: String): Set<String> {
        logger.warn { "[NoOp] getSetMembers - key: $key" }
        return emptySet()
    }

    override fun addToSet(key: String, value: String, ttl: Duration) {
        logger.warn { "[NoOp] addToSet - key: $key, value: $value, ttl: $ttl" }
    }

    override fun deleteFromSet(key: String, value: String) {
        logger.warn { "[NoOp] removeFromSet - key: $key, value: $value" }
    }
}
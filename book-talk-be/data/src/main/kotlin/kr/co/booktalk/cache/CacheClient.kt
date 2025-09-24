package kr.co.booktalk.cache

import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.data.redis.core.RedisTemplate
import org.springframework.stereotype.Component
import java.time.Duration

@Component
class CacheClient(
    private val redisTemplate: RedisTemplate<String, String>
) {
    private val logger = KotlinLogging.logger {}

    fun get(key: String): String? {
        return try {
            redisTemplate.opsForValue().get(key)
        } catch (e: Exception) {
            logger.warn(e) { "Redis get 실패 - key: $key" }
            null
        }
    }

    fun set(key: String, value: String, ttl: Duration? = null) {
        try {
            if (ttl != null) {
                redisTemplate.opsForValue().set(key, value, ttl)
            } else {
                redisTemplate.opsForValue().set(key, value)
            }
        } catch (e: Exception) {
            logger.warn(e) { "Redis set 실패 - key: $key" }
        }
    }

    fun delete(key: String) {
        try {
            redisTemplate.delete(key)
        } catch (e: Exception) {
            logger.warn(e) { "Redis delete 실패 - key: $key" }
        }
    }

    fun exists(key: String): Boolean {
        return try {
            redisTemplate.hasKey(key)
        } catch (e: Exception) {
            logger.warn(e) { "Redis exists 실패 - key: $key" }
            false
        }
    }
}
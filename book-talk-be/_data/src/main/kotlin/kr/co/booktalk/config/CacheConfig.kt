package kr.co.booktalk.config

import io.github.oshai.kotlinlogging.KotlinLogging
import kr.co.booktalk.cache.CacheClient
import kr.co.booktalk.cache.NoOpCacheClient
import kr.co.booktalk.cache.RedisCacheClient
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.data.redis.connection.RedisConnectionFactory
import org.springframework.data.redis.core.RedisTemplate

@Configuration
class CacheConfig {
    private val logger = KotlinLogging.logger {}

    @Bean
    fun cacheClient(
        redisTemplate: RedisTemplate<String, String>,
        connectionFactory: RedisConnectionFactory
    ): CacheClient {
        return try {
            connectionFactory.connection.use { connection -> connection.ping() }
            logger.info { "Redis 연결 성공. RedisCacheClient를 생성합니다." }
            RedisCacheClient(redisTemplate)
        } catch (e: Exception) {
            logger.warn(e) { "Redis 연결 실패. NoOpCacheClient를 생성합니다." }
            NoOpCacheClient()
        }
    }
}
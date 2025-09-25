package kr.co.booktalk.config

import kr.co.booktalk.presence.PresenceWebSocketHandler
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.data.redis.connection.RedisConnectionFactory
import org.springframework.data.redis.core.RedisTemplate
import org.springframework.data.redis.listener.ChannelTopic
import org.springframework.data.redis.listener.RedisMessageListenerContainer
import org.springframework.data.redis.listener.adapter.MessageListenerAdapter
import org.springframework.data.redis.serializer.StringRedisSerializer

@Configuration
class PresenceRedisConfig {
    @Bean
    fun presenceChannelTopic(): ChannelTopic {
        return ChannelTopic(PresenceWebSocketHandler.Companion.PRESENCE_CHANNEL)
    }

    @Bean
    fun presenceMessageListenerAdapter(presenceWebSocketHandler: PresenceWebSocketHandler): MessageListenerAdapter {
        return MessageListenerAdapter(presenceWebSocketHandler, "handlePresenceMessage")
    }

    @Bean
    fun redisMessageListenerContainer(
        connectionFactory: RedisConnectionFactory,
        presenceMessageListenerAdapter: MessageListenerAdapter,
        presenceChannelTopic: ChannelTopic
    ): RedisMessageListenerContainer {
        val container = RedisMessageListenerContainer()
        container.setConnectionFactory(connectionFactory)
        container.addMessageListener(presenceMessageListenerAdapter, presenceChannelTopic)
        return container
    }

    @Bean
    fun presenceRedisTemplate(connectionFactory: RedisConnectionFactory): RedisTemplate<String, String> {
        val template = RedisTemplate<String, String>()
        template.connectionFactory = connectionFactory
        template.keySerializer = StringRedisSerializer()
        template.valueSerializer = StringRedisSerializer()
        template.hashKeySerializer = StringRedisSerializer()
        template.hashValueSerializer = StringRedisSerializer()
        return template
    }
}
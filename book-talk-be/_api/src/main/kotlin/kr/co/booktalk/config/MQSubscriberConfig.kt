package kr.co.booktalk.config

import com.fasterxml.jackson.databind.ObjectMapper
import io.github.oshai.kotlinlogging.KotlinLogging
import kr.co.booktalk.cache.DebateOnlineAccountsCache
import kr.co.booktalk.cache.WebSocketSessionCache
import kr.co.booktalk.client.MonitorClient
import kr.co.booktalk.domain.debate.DebateEventSubscriber
import kr.co.booktalk.domain.debate.NoOpDebateEventSubscriber
import kr.co.booktalk.domain.debate.RabbitMQDebateEventSubscriber
import org.springframework.amqp.core.*
import org.springframework.amqp.rabbit.config.SimpleRabbitListenerContainerFactory
import org.springframework.amqp.rabbit.connection.ConnectionFactory
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class MQSubscriberConfig {
    private val logger = KotlinLogging.logger {}

    @Bean
    fun rabbitListenerContainerFactory(
        connectionFactory: ConnectionFactory
    ): SimpleRabbitListenerContainerFactory {
        return SimpleRabbitListenerContainerFactory().apply {
            setConnectionFactory(connectionFactory)
            setAcknowledgeMode(AcknowledgeMode.MANUAL)
        }
    }

    @Bean
    fun debateQueue() = Queue(QueueName.DEBATE.value, true)

    @Bean
    fun debateBindings(
        debateExchange: TopicExchange,
        debateQueue: Queue
    ) = Declarables(
        BindingBuilder.bind(debateQueue).to(debateExchange).with("debate.request.#"),
        BindingBuilder.bind(debateQueue).to(debateExchange).with("debate.success.#")
    )

    @Bean
    fun debateFailedQueue() = Queue(QueueName.DEBATE_FAILED.value, true)

    @Bean
    fun debateFailedBinding(
        debateExchange: TopicExchange,
        debateFailedQueue: Queue
    ): Binding = BindingBuilder.bind(debateFailedQueue).to(debateExchange).with("debate.failed.#")

    @Bean
    fun connectionQueue() = Queue(QueueName.CONNECTION.value, true)

    @Bean
    fun connectionBindings(
        connectionExchange: TopicExchange,
        connectionQueue: Queue
    ) = Declarables(
        BindingBuilder.bind(connectionQueue).to(connectionExchange).with("connection.success.#"),
        BindingBuilder.bind(connectionQueue).to(connectionExchange).with("connection.request.#")
    )
    @Bean
    fun connectionFailedQueue() = Queue(QueueName.CONNECTION_FAILED.value, true)

    @Bean
    fun connectionFailedBinding(
        connectionExchange: TopicExchange,
        connectionFailedQueue: Queue
    ): Binding = BindingBuilder.bind(connectionFailedQueue).to(connectionExchange).with("connection.failed.#")

    @Bean
    fun debateEventSubscriber(
        properties: AppProperties,
        objectMapper: ObjectMapper,
        webSocketSessionCache: WebSocketSessionCache,
        debateOnlineAccountsCache: DebateOnlineAccountsCache,
        monitorClient: MonitorClient
    ): DebateEventSubscriber {
        return if (properties.mq.subEnabled) {
            RabbitMQDebateEventSubscriber(objectMapper, webSocketSessionCache, debateOnlineAccountsCache, monitorClient)
        } else {
            logger.warn { "[NoOp] DebateEventPublisher를 비활성화하고 DebateNoOpEventPublisher를 사용합니다." }
            NoOpDebateEventSubscriber()
        }
    }
}

enum class QueueName(val value: String) {
    DEBATE("debate.queue"),
    DEBATE_FAILED("debate.failed.queue"),
    CONNECTION("connection.queue"),
    CONNECTION_FAILED("connection.failed.queue"),
}
package kr.co.booktalk.config

import org.springframework.amqp.core.*
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class MQSubscriberConfig {
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
}

enum class QueueName(val value: String) {
    DEBATE("debate.queue"),
    DEBATE_FAILED("debate.failed.queue"),
    CONNECTION("connection.queue"),
    CONNECTION_FAILED("connection.failed.queue"),
}
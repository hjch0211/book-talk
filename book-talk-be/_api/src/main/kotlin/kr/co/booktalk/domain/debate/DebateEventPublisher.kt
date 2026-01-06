package kr.co.booktalk.domain.debate

import io.github.oshai.kotlinlogging.KotlinLogging
import kr.co.booktalk.Event
import kr.co.booktalk.EventPublisher
import kr.co.booktalk.config.ExchangeName
import org.springframework.amqp.core.MessageDeliveryMode
import org.springframework.amqp.rabbit.core.RabbitTemplate
import java.util.*

interface DebateEventPublisher : EventPublisher

class RabbitMQDebateEventPublisher(
    private val rabbitTemplate: RabbitTemplate,
) : DebateEventPublisher {
    override fun <T> publish(event: Event<T>) {
        rabbitTemplate.convertAndSend(ExchangeName.DEBATE.value, event.type, event.payload) { message ->
            message.messageProperties.apply {
                messageId = event.id.toString()
                timestamp = Date.from(event.occurredAt)
                contentType = "application/json"
                type = event.type
                appId = "book-talk-api"
                deliveryMode = MessageDeliveryMode.PERSISTENT
            }
            message
        }
    }
}

class NoOpDebateEventPublisher : DebateEventPublisher {
    private val logger = KotlinLogging.logger {}

    override fun <T> publish(event: Event<T>) {
        logger.warn { "[NoOp] publish: $event" }
    }
}
package kr.co.booktalk.config

import io.github.oshai.kotlinlogging.KotlinLogging
import kr.co.booktalk.domain.debate.DebateEventPublisher
import kr.co.booktalk.domain.debate.NoOpDebateEventPublisher
import kr.co.booktalk.domain.debate.RabbitMQDebateEventPublisher
import org.springframework.amqp.core.TopicExchange
import org.springframework.amqp.rabbit.core.RabbitTemplate
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class MQPublisherConfig {
    private val logger = KotlinLogging.logger {}

    @Bean
    fun debateExchange() = TopicExchange(ExchangeName.DEBATE.value, true, false)

    @Bean
    fun connectionExchange() = TopicExchange(ExchangeName.CONNECTION.value, true, false)

    @Bean
    fun debateEventPublisher(
        properties: AppProperties,
        rabbitTemplate: RabbitTemplate,
    ): DebateEventPublisher {
        return if (properties.mq.pubEnabled) {
            RabbitMQDebateEventPublisher(rabbitTemplate)
        } else {
            logger.warn { "[NoOp] DebateEventPublisher를 비활성화하고 DebateNoOpEventPublisher를 사용합니다." }
            NoOpDebateEventPublisher()
        }
    }
}

enum class ExchangeName(val value: String) {
    DEBATE("debate"),
    CONNECTION("connection"),
}
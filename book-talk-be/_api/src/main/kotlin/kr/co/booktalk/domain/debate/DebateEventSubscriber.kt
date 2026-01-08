package kr.co.booktalk.domain.debate

import com.rabbitmq.client.Channel
import io.github.oshai.kotlinlogging.KotlinLogging
import jakarta.annotation.PreDestroy
import kotlinx.coroutines.*
import kr.co.booktalk.EventSubscriber
import kr.co.booktalk.MQInvalidMessageException
import kr.co.booktalk.MQNetWorkErrorException
import kr.co.booktalk.client.MonitorClient
import kr.co.booktalk.client.SendRequest
import org.springframework.amqp.core.Message
import org.springframework.amqp.rabbit.annotation.RabbitHandler
import org.springframework.amqp.rabbit.annotation.RabbitListener

/** Debate event subscriber */
interface DebateEventSubscriber : EventSubscriber

@RabbitListener(queues = ["debate.queue"])
class RabbitMQDebateEventSubscriber(
    private val monitorClient: MonitorClient,
) : DebateEventSubscriber {
    private val logger = KotlinLogging.logger {}
    private val scope = CoroutineScope(
        SupervisorJob() + Dispatchers.IO + CoroutineName("rabbit-mq-debate-event-subscriber")
    )

    @PreDestroy
    fun destroy() {
        scope.cancel()
    }

    @RabbitHandler
    fun handle(message: Message, channel: Channel) {
        val deliveryTag = message.messageProperties.deliveryTag
        try {
            when (message.messageProperties.type) {
            }

            channel.basicAck(deliveryTag, false)
        } catch (e: MQNetWorkErrorException) {
            logger.error { e.message }

            channel.basicNack(deliveryTag, false, true)
        } catch (e: MQInvalidMessageException) {
            logger.error { e.message }

            channel.basicNack(deliveryTag, false, false)
        } catch (e: Exception) {
            logger.error { e.message }

            scope.launch {
                monitorClient.send(
                    SendRequest(
                        title = "[book-talk-api] INTERNAL SERVER ERROR",
                        message = "${e.message}",
                        stackTrace = e.stackTraceToString(),
                        level = SendRequest.Level.ERROR
                    )
                )
            }

            channel.basicNack(deliveryTag, false, false)
        }
    }
}

class NoOpDebateEventSubscriber : DebateEventSubscriber
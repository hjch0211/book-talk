package kr.co.booktalk

import java.time.Instant
import java.util.*

data class Event<T>(
    /** 이벤트 식별자 */
    val id: UUID,
    /** 이벤트 타입 */
    val type: String,
    /** 발행자(name of bean) */
    val publisher: String,
    /** 발생시각(UTC) */
    val occurredAt: Instant,
    /** 페이로드 */
    val payload: T? = null
) {
    companion object {
        fun <T> build(type: String, publisher: String, payload: T? = null) = Event(
            id = UUID.randomUUID(),
            type = type,
            publisher = publisher,
            occurredAt = Instant.now(),
            payload = payload
        )
    }
}

interface EventPublisher {
    fun <T> publish(event: Event<T>)
}

interface EventSubscriber
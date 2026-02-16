package kr.co.booktalk.domain

import jakarta.persistence.*
import kr.co.booktalk.AuditableUuidEntity
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import java.util.*

@Entity
@Table(name = "ai_chat_message")
@EntityListeners(AuditingEntityListener::class)
class AiChatMessageEntity(
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chat_id", nullable = false)
    val chat: AiChatEntity,

    val role: String,

    val content: String,
) : AuditableUuidEntity()

@Transactional(readOnly = true)
@Repository
interface AiChatMessageRepository : JpaRepository<AiChatMessageEntity, UUID> {
}
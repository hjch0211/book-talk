package kr.co.booktalk.domain

import jakarta.persistence.*
import kr.co.booktalk.AuditableUuidEntity
import org.hibernate.annotations.SQLRestriction
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import java.time.Instant
import java.util.*

@Entity
@Table(name = "ai_chat_message")
@EntityListeners(AuditingEntityListener::class)
@SQLRestriction("archived_at IS NULL")
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
    @Modifying
    @Transactional
    @Query("UPDATE AiChatMessageEntity m SET m.archivedAt = :now WHERE m.chat IN (SELECT c FROM AiChatEntity c WHERE c.debate = :debate) AND m.archivedAt IS NULL")
    fun archiveAllByDebate(@Param("debate") debate: DebateEntity, @Param("now") now: Instant)
}
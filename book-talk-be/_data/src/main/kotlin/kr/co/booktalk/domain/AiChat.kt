package kr.co.booktalk.domain

import jakarta.persistence.*
import kr.co.booktalk.AuditableUuidEntity
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import java.util.*

@Entity
@Table(name = "ai_chat")
@EntityListeners(AuditingEntityListener::class)
class AiChatEntity(
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "debate_id", nullable = false)
    val debate: DebateEntity,

    val persona: String,
) : AuditableUuidEntity()

@Transactional(readOnly = true)
@Repository
interface AiChatRepository : JpaRepository<AiChatEntity, UUID>
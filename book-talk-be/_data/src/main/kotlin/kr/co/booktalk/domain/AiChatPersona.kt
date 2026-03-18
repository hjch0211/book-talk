package kr.co.booktalk.domain

import jakarta.persistence.*
import kr.co.booktalk.AuditableStringIdEntity
import org.hibernate.annotations.SQLRestriction
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

@Entity
@Table(name = "ai_chat_persona")
@EntityListeners(AuditingEntityListener::class)
@SQLRestriction("archived_at IS NULL")
class AiChatPersonaEntity(
    id: String,

    @Column(name = "agent_id")
    val agentId: String,
) : AuditableStringIdEntity(id)

@Transactional(readOnly = true)
@Repository
interface AiChatPersonaRepository : JpaRepository<AiChatPersonaEntity, String>

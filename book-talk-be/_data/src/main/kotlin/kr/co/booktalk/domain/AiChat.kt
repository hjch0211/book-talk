package kr.co.booktalk.domain

import jakarta.persistence.*
import kr.co.booktalk.AuditableLongIdEntity
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
@Table(name = "ai_chat")
@EntityListeners(AuditingEntityListener::class)
@SQLRestriction("archived_at IS NULL")
class AiChatEntity(
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "debate_id", nullable = false)
    val debate: DebateEntity,

    @Column(name = "persona_id", nullable = false, length = 50)
    val personaId: String,

    @Column(name = "name", nullable = false, length = 100)
    val name: String,
) : AuditableUuidEntity()

@Transactional(readOnly = true)
@Repository
interface AiChatRepository : JpaRepository<AiChatEntity, UUID> {
    @Modifying
    @Transactional
    @Query("UPDATE AiChatEntity c SET c.archivedAt = :now WHERE c.debate = :debate AND c.archivedAt IS NULL")
    fun archiveAllByDebate(@Param("debate") debate: DebateEntity, @Param("now") now: Instant)
}

enum class AiChatSearchResultType { NEWS, BLOG }

@Entity
@Table(name = "ai_chat_search_result")
@EntityListeners(AuditingEntityListener::class)
class AiChatSearchResultEntity(
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chat_id", nullable = false)
    val chat: AiChatEntity,

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false, length = 10)
    val type: AiChatSearchResultType,

    @Column(name = "title", nullable = false, columnDefinition = "TEXT")
    val title: String,

    @Column(name = "url", nullable = false, columnDefinition = "TEXT")
    val url: String,

    @Column(name = "content", nullable = false, columnDefinition = "TEXT")
    val content: String,
) : AuditableLongIdEntity()

@Transactional(readOnly = true)
@Repository
interface AiChatSearchResultRepository : JpaRepository<AiChatSearchResultEntity, Long> {
    fun findByChatIdOrderByCreatedAtAsc(chatId: UUID): List<AiChatSearchResultEntity>
}
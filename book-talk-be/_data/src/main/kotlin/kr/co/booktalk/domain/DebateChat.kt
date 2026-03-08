package kr.co.booktalk.domain

import jakarta.persistence.*
import kr.co.booktalk.AuditableLongIdEntity
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
@Table(name = "debate_chat")
@EntityListeners(AuditingEntityListener::class)
@SQLRestriction("archived_at IS NULL")
class DebateChatEntity(
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "debate_id", nullable = false)
    val debate: DebateEntity,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    val account: AccountEntity,

    var content: String,
) : AuditableLongIdEntity()

@Transactional(readOnly = true)
@Repository
interface DebateChatRepository : JpaRepository<DebateChatEntity, Long> {
    @Query("SELECT dc FROM DebateChatEntity dc JOIN FETCH dc.account WHERE dc.debate.id = :debateId ORDER BY dc.createdAt ASC")
    fun findByDebateIdOrderByCreatedAt(debateId: UUID): List<DebateChatEntity>

    @Modifying
    @Transactional
    @Query("UPDATE DebateChatEntity dc SET dc.archivedAt = :now WHERE dc.account = :account AND dc.archivedAt IS NULL")
    fun archiveAllByAccount(@Param("account") account: AccountEntity, @Param("now") now: Instant)

    @Modifying
    @Transactional
    @Query("UPDATE DebateChatEntity dc SET dc.archivedAt = :now WHERE dc.debate = :debate AND dc.archivedAt IS NULL")
    fun archiveAllByDebate(@Param("debate") debate: DebateEntity, @Param("now") now: Instant)
}
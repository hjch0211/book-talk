package kr.co.booktalk.domain

import jakarta.persistence.*
import kr.co.booktalk.AuditableLongIdEntity
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import java.util.*

@Entity
@Table(name = "debate_chat")
@EntityListeners(AuditingEntityListener::class)
class DebateChatEntity(
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "debate_id", nullable = false)
    val debate: DebateEntity,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    val account: AccountEntity,

    @Column(nullable = false)
    var content: String,
) : AuditableLongIdEntity()

@Transactional(readOnly = true)
@Repository
interface DebateChatRepository : JpaRepository<DebateChatEntity, Long> {
    @Query("SELECT dc FROM DebateChatEntity dc JOIN FETCH dc.account WHERE dc.debate.id = :debateId ORDER BY dc.createdAt ASC")
    fun findByDebateIdOrderByCreatedAt(debateId: UUID): List<DebateChatEntity>
}
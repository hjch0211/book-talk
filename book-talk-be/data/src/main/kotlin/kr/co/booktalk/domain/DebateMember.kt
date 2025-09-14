package kr.co.booktalk.domain

import jakarta.persistence.*
import kr.co.booktalk.AuditableLongIdEntity
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Lock
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

@Entity
@Table(name = "debate_member")
@EntityListeners(AuditingEntityListener::class)
class DebateMemberEntity(
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "debate_id", nullable = false)
    val debate: DebateEntity,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    val account: AccountEntity,

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    val role: DebateMemberRole
) : AuditableLongIdEntity()

enum class DebateMemberRole {
    HOST, MEMBER
}

@Transactional(readOnly = true)
@Repository
interface DebateMemberRepository : JpaRepository<DebateMemberEntity, Long> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select count(m) from DebateMemberEntity m where m.debate = :debate")
    fun countByDebateForUpdate(debate: DebateEntity): Int

    fun findAllByDebateOrderByCreatedAtAsc(debate: DebateEntity): List<DebateMemberEntity>
}
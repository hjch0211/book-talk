package kr.co.booktalk.domain

import jakarta.persistence.*
import kr.co.booktalk.AuditableLongIdEntity
import org.hibernate.annotations.SQLRestriction
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Lock
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import java.time.Instant
import java.util.*

@Entity
@Table(name = "debate_member")
@EntityListeners(AuditingEntityListener::class)
@SQLRestriction("archived_at IS NULL")
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
    @Query("select count(m) from DebateMemberEntity m where m.debate = :debate")
    fun countByDebate(debate: DebateEntity): Int

    fun findAllByDebateOrderByCreatedAtAsc(debate: DebateEntity): List<DebateMemberEntity>
    fun existsByDebateAndAccountId(debate: DebateEntity, accountId: UUID): Boolean

    @Query("SELECT m FROM DebateMemberEntity m JOIN FETCH m.account WHERE m.debate IN :debates")
    fun findAllByDebateIn(@Param("debates") debates: List<DebateEntity>): List<DebateMemberEntity>

    @Modifying
    @Transactional
    @Query("UPDATE DebateMemberEntity m SET m.archivedAt = :now WHERE m.account = :account AND m.archivedAt IS NULL")
    fun archiveAllByAccount(@Param("account") account: AccountEntity, @Param("now") now: Instant)

    @Modifying
    @Transactional
    @Query("UPDATE DebateMemberEntity m SET m.archivedAt = :now WHERE m.debate = :debate AND m.archivedAt IS NULL")
    fun archiveAllByDebate(@Param("debate") debate: DebateEntity, @Param("now") now: Instant)

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT m FROM DebateMemberEntity m WHERE m.debate = :debate AND m.account = :account")
    fun findByDebateAndAccountForUpdate(
        @Param("debate") debate: DebateEntity,
        @Param("account") account: AccountEntity,
    ): DebateMemberEntity?
}
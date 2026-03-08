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
@Table(name = "presentation")
@EntityListeners(AuditingEntityListener::class)
@SQLRestriction("archived_at IS NULL")
class PresentationEntity(
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "debate_id", nullable = false)
    val debate: DebateEntity,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    val account: AccountEntity,

    var content: String,
) : AuditableUuidEntity()

@Transactional(readOnly = true)
@Repository
interface PresentationRepository : JpaRepository<PresentationEntity, UUID> {
    fun findAllByDebateOrderByCreatedAtAsc(debate: DebateEntity): List<PresentationEntity>

    @Modifying
    @Transactional
    fun deleteByDebateAndAccount(debate: DebateEntity, account: AccountEntity)

    @Modifying
    @Transactional
    @Query("UPDATE PresentationEntity p SET p.archivedAt = :now WHERE p.account = :account AND p.archivedAt IS NULL")
    fun archiveAllByAccount(@Param("account") account: AccountEntity, @Param("now") now: Instant)

    @Modifying
    @Transactional
    @Query("UPDATE PresentationEntity p SET p.archivedAt = :now WHERE p.debate = :debate AND p.archivedAt IS NULL")
    fun archiveAllByDebate(@Param("debate") debate: DebateEntity, @Param("now") now: Instant)
}
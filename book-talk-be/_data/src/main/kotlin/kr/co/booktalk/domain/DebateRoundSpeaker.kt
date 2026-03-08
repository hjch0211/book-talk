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

@Entity
@Table(name = "debate_round_speaker")
@EntityListeners(AuditingEntityListener::class)
@SQLRestriction("archived_at IS NULL")
class DebateRoundSpeakerEntity(
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "debate_round_id", nullable = false)
    val debateRound: DebateRoundEntity,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    val account: AccountEntity,

    var endedAt: Instant,

    var isActive: Boolean,
) : AuditableLongIdEntity()

@Transactional(readOnly = true)
@Repository
interface DebateRoundSpeakerRepository : JpaRepository<DebateRoundSpeakerEntity, Long> {
    fun findByDebateRoundAndIsActive(currentRound: DebateRoundEntity, isActive: Boolean): DebateRoundSpeakerEntity?

    fun findAllByIsActiveTrueAndEndedAtBeforeAndDebateRoundTypeAndDebateRoundEndedAtIsNull(
        endedAt: Instant,
        type: DebateRoundType
    ): List<DebateRoundSpeakerEntity>

    @Modifying
    @Transactional
    @Query("UPDATE DebateRoundSpeakerEntity s SET s.archivedAt = :now WHERE s.account = :account AND s.archivedAt IS NULL")
    fun archiveAllByAccount(@Param("account") account: AccountEntity, @Param("now") now: Instant)

    @Modifying
    @Transactional
    @Query("UPDATE DebateRoundSpeakerEntity s SET s.archivedAt = :now WHERE s.debateRound IN (SELECT r FROM DebateRoundEntity r WHERE r.debate = :debate) AND s.archivedAt IS NULL")
    fun archiveAllByDebate(@Param("debate") debate: DebateEntity, @Param("now") now: Instant)
}
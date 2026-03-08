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
@Table(name = "debate_round")
@EntityListeners(AuditingEntityListener::class)
@SQLRestriction("archived_at IS NULL")
class DebateRoundEntity(
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "debate_id", nullable = false)
    val debate: DebateEntity,

    @Enumerated(EnumType.STRING)
    val type: DebateRoundType,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "next_speaker_id")
    var nextSpeaker: AccountEntity? = null,

    var endedAt: Instant? = null
) : AuditableLongIdEntity()

enum class DebateRoundType {
    PREPARATION, PRESENTATION, FREE
}

@Transactional(readOnly = true)
@Repository
interface DebateRoundRepository : JpaRepository<DebateRoundEntity, Long> {
    fun findByDebateIdAndEndedAtIsNull(debateId: java.util.UUID): DebateRoundEntity?

    @Modifying
    @Transactional
    @Query("UPDATE DebateRoundEntity r SET r.nextSpeaker = null WHERE r.nextSpeaker = :account")
    fun clearNextSpeakerByAccount(@Param("account") account: AccountEntity)

    @Modifying
    @Transactional
    @Query("UPDATE DebateRoundEntity r SET r.archivedAt = :now WHERE r.debate = :debate AND r.archivedAt IS NULL")
    fun archiveAllByDebate(@Param("debate") debate: DebateEntity, @Param("now") now: Instant)
}
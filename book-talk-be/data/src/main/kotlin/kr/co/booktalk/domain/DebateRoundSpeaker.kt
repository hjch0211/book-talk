package kr.co.booktalk.domain

import jakarta.persistence.*
import kr.co.booktalk.AuditableLongIdEntity
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import java.time.Instant

@Entity
@Table(name = "debate_round_speaker")
@EntityListeners(AuditingEntityListener::class)
class DebateRoundSpeakerEntity(
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "debate_round_id", nullable = false)
    val debateRound: DebateRoundEntity,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    val account: AccountEntity,

    @Column(nullable = false)
    var endedAt: Instant,
) : AuditableLongIdEntity()

@Transactional(readOnly = true)
@Repository
interface DebateRoundSpeakerRepository : JpaRepository<DebateRoundSpeakerEntity, Long> {
    fun findByDebateRoundAndEndedAtIsAfter(currentRound: DebateRoundEntity, now: Instant): DebateRoundSpeakerEntity?
}
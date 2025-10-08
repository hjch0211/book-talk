package kr.co.booktalk.domain

import jakarta.persistence.*
import kr.co.booktalk.AuditableLongIdEntity
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import java.time.Instant

@Entity
@Table(name = "debate_round")
@EntityListeners(AuditingEntityListener::class)
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
    PRESENTATION, FREE
}

@Transactional(readOnly = true)
@Repository
interface DebateRoundRepository : JpaRepository<DebateRoundEntity, Long> {
    fun findByDebateIdAndEndedAtIsNull(debateId: java.util.UUID): DebateRoundEntity?
}
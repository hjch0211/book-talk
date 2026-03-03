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
@Table(name = "debate_summarization")
@EntityListeners(AuditingEntityListener::class)
@SQLRestriction("archived_at IS NULL")
class DebateSummarizationEntity(
    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "debate_id", nullable = false)
    val debate: DebateEntity,

    @Column(name = "content", nullable = false)
    var content: String,
) : AuditableLongIdEntity()

@Transactional(readOnly = true)
@Repository
interface DebateSummarizationRepository : JpaRepository<DebateSummarizationEntity, Long> {
    fun findByDebateId(debateId: UUID): DebateSummarizationEntity?

    @Modifying
    @Transactional
    @Query("UPDATE DebateSummarizationEntity s SET s.archivedAt = :now WHERE s.debate = :debate AND s.archivedAt IS NULL")
    fun archiveAllByDebate(@Param("debate") debate: DebateEntity, @Param("now") now: Instant)
}
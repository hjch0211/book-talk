package kr.co.booktalk.domain

import jakarta.persistence.*
import kr.co.booktalk.AuditableLongIdEntity
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import java.util.*

@Entity
@Table(name = "debate_summarization")
@EntityListeners(AuditingEntityListener::class)
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
}
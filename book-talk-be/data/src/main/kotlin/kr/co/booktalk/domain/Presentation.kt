package kr.co.booktalk.domain

import jakarta.persistence.*
import kr.co.booktalk.AuditableUuidEntity
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

@Entity
@Table(name = "presentation")
@EntityListeners(AuditingEntityListener::class)
class PresentationEntity(
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "debate_id", nullable = false)
    val debate: DebateEntity,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    val account: AccountEntity,

    @Column(nullable = false)
    var content: String,
) : AuditableUuidEntity()

@Transactional(readOnly = true)
@Repository
interface PresentationRepository : JpaRepository<PresentationEntity, String> {
    fun findAllByDebateOrderByCreatedAtAsc(debate: DebateEntity): List<PresentationEntity>
}
package kr.co.booktalk.domain

import jakarta.persistence.*
import kr.co.booktalk.AuditableUuidEntity
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import java.time.Instant

@Entity
@Table(name = "debate")
@EntityListeners(AuditingEntityListener::class)
class DebateEntity(
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "host_id", nullable = false)
    val host: AccountEntity,

    @Column(nullable = false, length = 300)
    val bookImageUrl: String,

    @Column(nullable = false, length = 100)
    val topic: String,

    @Column(length = 300)
    val description: String? = null,

    @Column(nullable = false)
    val headCount: Int,

    @Column(nullable = false)
    val startedAt: Instant,

    @Column
    val closedAt: Instant? = null,
) : AuditableUuidEntity()

@Transactional(readOnly = true)
@Repository
interface DebateRepository : JpaRepository<DebateEntity, String>
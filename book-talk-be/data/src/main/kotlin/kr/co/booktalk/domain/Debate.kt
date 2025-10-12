package kr.co.booktalk.domain

import jakarta.persistence.*
import kr.co.booktalk.AuditableUuidEntity
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import java.time.Instant
import java.util.*

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

    @Column
    var closedAt: Instant? = null,
) : AuditableUuidEntity()

@Transactional(readOnly = true)
@Repository
interface DebateRepository : JpaRepository<DebateEntity, UUID> {
    /**
     * 생성된 지 24시간이 지났고 아직 종료되지 않은 토론을 조회
     * Scheduler에서 자동 종료 대상 토론을 찾기 위해 사용
     */
    fun findAllByCreatedAtBeforeAndClosedAtIsNull(createdAt: Instant): List<DebateEntity>
}
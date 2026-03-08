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
@Table(name = "debate_notification")
@EntityListeners(AuditingEntityListener::class)
@SQLRestriction("archived_at IS NULL")
class DebateNotificationEntity(
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "debate_id", nullable = false)
    val debate: DebateEntity,

    var scheduledAt: Instant,

    var isCompleted: Boolean = false,
) : AuditableLongIdEntity()

@Transactional(readOnly = true)
@Repository
interface DebateNotificationRepository : JpaRepository<DebateNotificationEntity, Long> {
    @Query("""
        SELECT n FROM DebateNotificationEntity n
        JOIN FETCH n.debate d
        WHERE n.isCompleted = false
        AND n.scheduledAt <= :now
        AND d.closedAt IS NULL
    """)
    fun findAllPending(@Param("now") now: Instant): List<DebateNotificationEntity>

    @Modifying
    @Transactional
    @Query("DELETE FROM DebateNotificationEntity n WHERE n.debate = :debate")
    fun deleteAllByDebate(@Param("debate") debate: DebateEntity)

    @Modifying
    @Transactional
    @Query("DELETE FROM DebateNotificationEntity n WHERE n.debate IN :debates")
    fun deleteAllByDebateIn(@Param("debates") debates: List<DebateEntity>)
}
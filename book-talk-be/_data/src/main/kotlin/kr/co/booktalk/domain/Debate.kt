package kr.co.booktalk.domain

import jakarta.persistence.*
import kr.co.booktalk.AuditableUuidEntity
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import jakarta.persistence.LockModeType
import org.hibernate.annotations.SQLRestriction
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Lock
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import java.time.Instant
import java.util.*

@Entity
@Table(name = "debate")
@EntityListeners(AuditingEntityListener::class)
@SQLRestriction("archived_at IS NULL")
class DebateEntity(
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "host_id", nullable = false)
    val host: AccountEntity,

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "book_id", nullable = false)
    val book: BookEntity,

    var topic: String,

    var description: String? = null,

    var maxMemberCount: Int,

    var startAt: Instant,

    var closedAt: Instant? = null,
) : AuditableUuidEntity()

@Transactional(readOnly = true)
@Repository
interface DebateRepository : JpaRepository<DebateEntity, UUID> {
    /**
     * 생성된 지 24시간이 지났고 아직 종료되지 않은 토론을 조회
     * Scheduler에서 자동 종료 대상 토론을 찾기 위해 사용
     */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT d FROM DebateEntity d WHERE d.id = :id")
    fun findByIdForUpdate(@Param("id") id: UUID): DebateEntity?

    @Modifying
    @Transactional
    @Query("UPDATE DebateEntity d SET d.archivedAt = :now WHERE d.host = :host AND d.archivedAt IS NULL")
    fun archiveAllByHost(@Param("host") host: AccountEntity, @Param("now") now: Instant)

    fun findAllByHost(host: AccountEntity): List<DebateEntity>
    fun findAllByCreatedAtBeforeAndClosedAtIsNull(createdAt: Instant): List<DebateEntity>
    fun findAllByStartAtBeforeAndClosedAtIsNull(startAt: Instant): List<DebateEntity>

    @Query("""
        SELECT d FROM DebateEntity d
        WHERE d.closedAt IS NULL
        AND d.startAt >= :from AND d.startAt < :to
    """)
    fun findAllByStartAtBetweenAndClosedAtIsNull(
        @Param("from") from: Instant,
        @Param("to") to: Instant,
    ): List<DebateEntity>

    @Query(
        value = """
            SELECT d FROM DebateEntity d JOIN d.book b
            WHERE d.book IN :books
            AND (:hostId IS NULL OR d.host.id = :hostId)
            AND (:canJoin IS NULL OR (:canJoin = TRUE AND d.startAt > CURRENT_TIMESTAMP AND d.closedAt IS NULL AND (SELECT COUNT(m) FROM DebateMemberEntity m WHERE m.debate = d) < d.maxMemberCount))
            ORDER BY
                CASE
                    WHEN d.closedAt IS NOT NULL THEN 2
                    WHEN d.startAt <= CURRENT_TIMESTAMP THEN 1
                    ELSE 0
                END ASC,
                b.author ASC
        """,
        countQuery = """
            SELECT COUNT(d) FROM DebateEntity d
            WHERE d.book IN :books
            AND (:hostId IS NULL OR d.host.id = :hostId)
            AND (:canJoin IS NULL OR (:canJoin = TRUE AND d.startAt > CURRENT_TIMESTAMP AND d.closedAt IS NULL AND (SELECT COUNT(m) FROM DebateMemberEntity m WHERE m.debate = d) < d.maxMemberCount))
        """
    )
    fun findAllWithFilters(
        @Param("books") books: List<BookEntity>,
        @Param("hostId") hostId: UUID?,
        @Param("canJoin") canJoin: Boolean?,
        pageable: Pageable,
    ): Page<DebateEntity>
}

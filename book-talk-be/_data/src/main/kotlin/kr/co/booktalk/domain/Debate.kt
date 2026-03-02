package kr.co.booktalk.domain

import jakarta.persistence.*
import kr.co.booktalk.AuditableUuidEntity
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
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

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "book_id", nullable = false)
    val book: BookEntity,

    val topic: String,

    val description: String? = null,

    val maxMemberCount: Int,

    val startAt: Instant,

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

    @Query(
        value = """
            SELECT d FROM DebateEntity d JOIN d.book b
            WHERE d.book IN :books
            AND (:accountId IS NULL OR EXISTS (
                SELECT m FROM DebateMemberEntity m WHERE m.debate = d AND m.account.id = :accountId
            ))
            AND (:roundType IS NULL OR EXISTS (
                SELECT r FROM DebateRoundEntity r WHERE r.debate = d AND r.type = :roundType AND r.endedAt IS NULL
            ))
            ORDER BY b.author ASC
        """,
        countQuery = """
            SELECT COUNT(d) FROM DebateEntity d
            WHERE d.book IN :books
            AND (:accountId IS NULL OR EXISTS (
                SELECT m FROM DebateMemberEntity m WHERE m.debate = d AND m.account.id = :accountId
            ))
            AND (:roundType IS NULL OR EXISTS (
                SELECT r FROM DebateRoundEntity r WHERE r.debate = d AND r.type = :roundType AND r.endedAt IS NULL
            ))
        """
    )
    fun findAllWithFilters(
        @Param("books") books: List<BookEntity>,
        @Param("accountId") accountId: UUID?,
        @Param("roundType") roundType: DebateRoundType?,
        pageable: Pageable,
    ): Page<DebateEntity>
}

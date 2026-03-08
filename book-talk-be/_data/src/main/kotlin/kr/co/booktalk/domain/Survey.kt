package kr.co.booktalk.domain

import jakarta.persistence.Entity
import jakarta.persistence.EntityListeners
import jakarta.persistence.FetchType
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
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
@Table(name = "survey")
@EntityListeners(AuditingEntityListener::class)
@SQLRestriction("archived_at IS NULL")
class SurveyEntity(
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    val account: AccountEntity,

    var rate: Int,
) : AuditableLongIdEntity()

@Transactional(readOnly = true)
@Repository
interface SurveyRepository : JpaRepository<SurveyEntity, Long> {
    @Modifying
    @Transactional
    @Query("UPDATE SurveyEntity s SET s.archivedAt = :now WHERE s.account = :account AND s.archivedAt IS NULL")
    fun archiveAllByAccount(@Param("account") account: AccountEntity, @Param("now") now: Instant)
}
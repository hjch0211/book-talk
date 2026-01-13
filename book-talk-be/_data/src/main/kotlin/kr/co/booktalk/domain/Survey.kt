package kr.co.booktalk.domain

import jakarta.persistence.Entity
import jakarta.persistence.EntityListeners
import jakarta.persistence.FetchType
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import kr.co.booktalk.AuditableLongIdEntity
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

@Entity
@Table(name = "survey")
@EntityListeners(AuditingEntityListener::class)
class SurveyEntity(
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    val account: AccountEntity,

    var rate: Int,
) : AuditableLongIdEntity()

@Transactional(readOnly = true)
@Repository
interface SurveyRepository : JpaRepository<SurveyEntity, Long>
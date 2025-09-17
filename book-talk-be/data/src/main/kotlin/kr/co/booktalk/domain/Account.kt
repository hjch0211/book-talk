package kr.co.booktalk.domain

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EntityListeners
import jakarta.persistence.Table
import kr.co.booktalk.AuditableUuidEntity
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

@Entity
@Table(name = "account")
@EntityListeners(AuditingEntityListener::class)
class AccountEntity(
    @Column(length = 50, nullable = false)
    var name: String,
) : AuditableUuidEntity()

@Transactional(readOnly = true)
@Repository
interface AccountRepository : JpaRepository<AccountEntity, String> {
    fun existsByName(name: String): Boolean
    fun findByName(name: String): AccountEntity?
}
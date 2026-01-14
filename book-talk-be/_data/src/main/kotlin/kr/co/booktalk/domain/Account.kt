package kr.co.booktalk.domain

import jakarta.persistence.Entity
import jakarta.persistence.EntityListeners
import jakarta.persistence.Table
import kr.co.booktalk.AuditableUuidEntity
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import java.util.*

@Entity
@Table(name = "account")
@EntityListeners(AuditingEntityListener::class)
class AccountEntity(
    var name: String = "",

    var refreshToken: String? = null
) : AuditableUuidEntity()

@Transactional(readOnly = true)
@Repository
interface AccountRepository : JpaRepository<AccountEntity, UUID> {
    fun existsByName(name: String): Boolean
    fun findByName(name: String): AccountEntity?
    fun findByRefreshToken(refreshToken: String): AccountEntity?
}
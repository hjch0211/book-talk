package kr.co.booktalk.domain

import jakarta.persistence.*
import kr.co.booktalk.AuditableLongIdEntity
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

@Entity
@Table(name = "default_nickname")
@EntityListeners(AuditingEntityListener::class)
class DefaultNicknameEntity(
    val name: String,
    val num: Int,
) : AuditableLongIdEntity()

@Transactional(readOnly = true)
@Repository
interface DefaultNicknameRepository : JpaRepository<DefaultNicknameEntity, Long> {
    @Query(value = "SELECT * FROM default_nickname WHERE archived_at IS NULL AND num <= 999 ORDER BY RANDOM() LIMIT 1", nativeQuery = true)
    fun findRandomAvailable(): DefaultNicknameEntity?
}
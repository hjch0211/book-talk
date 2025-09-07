package kr.co.booktalk.domain

import jakarta.persistence.*
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

@Entity
@Table(name = "app_config")
@EntityListeners(AuditingEntityListener::class)
class AppConfigEntity(
    @Id
    val key: String,

    @Column(nullable = false)
    val value: String,

    val cacheSeconds: Long? = null,
)

@Transactional(readOnly = true)
@Repository
interface AppConfigRepository : JpaRepository<AppConfigEntity, String>
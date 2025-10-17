package kr.co.booktalk.domain

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

@Entity
@Table(name = "app_config")
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
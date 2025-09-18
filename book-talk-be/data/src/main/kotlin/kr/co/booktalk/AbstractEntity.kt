package kr.co.booktalk

import jakarta.persistence.*
import org.springframework.data.annotation.CreatedDate
import org.springframework.data.annotation.LastModifiedDate
import org.springframework.data.domain.Persistable
import java.time.Instant
import java.util.*

interface AuditableEntity {
    var createdAt: Instant
    var updatedAt: Instant
    var archivedAt: Instant?
}

@MappedSuperclass
abstract class AuditableLongIdEntity : AuditableEntity, Persistable<Long> {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    val id: Long = 0

    @CreatedDate
    @Column(name = "created_at")
    override lateinit var createdAt: Instant

    @LastModifiedDate
    @Column(name = "updated_at")
    override lateinit var updatedAt: Instant

    @Column(name = "archived_at")
    override var archivedAt: Instant? = null

    override fun getId(): Long = id
    override fun isNew(): Boolean = !::createdAt.isInitialized
}

@MappedSuperclass
abstract class AuditableUuidEntity : AuditableEntity, Persistable<String> {
    @Id
    @Column(name = "id", columnDefinition = "uuid")
    private var id: String? = UUID.randomUUID().toString()

    @CreatedDate
    @Column(name = "created_at")
    override lateinit var createdAt: Instant

    @LastModifiedDate
    @Column(name = "updated_at")
    override lateinit var updatedAt: Instant

    @Column(name = "archived_at")
    override var archivedAt: Instant? = null

    override fun getId(): String? = id
    override fun isNew(): Boolean = !::createdAt.isInitialized
}
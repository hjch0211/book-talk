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

@Converter(autoApply = true)
class UuidToStringConverter : AttributeConverter<UUID, String> {
    override fun convertToDatabaseColumn(attribute: UUID?): String? = attribute?.toString()
    override fun convertToEntityAttribute(dbData: String?): UUID? = dbData?.let { UUID.fromString(it) }
}

@MappedSuperclass
abstract class AuditableUuidEntity : AuditableEntity, Persistable<String> {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", columnDefinition = "uuid")
    @Convert(converter = UuidToStringConverter::class)
    private var id: String? = null

    @CreatedDate
    @Column(name = "created_at")
    override lateinit var createdAt: Instant

    @LastModifiedDate
    @Column(name = "updated_at")
    override lateinit var updatedAt: Instant

    @Column(name = "archived_at")
    override var archivedAt: Instant? = null

    override fun getId(): String? = id
    override fun isNew(): Boolean = id == null
}
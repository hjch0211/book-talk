package kr.co.booktalk.domain

import jakarta.persistence.Entity
import jakarta.persistence.EntityListeners
import jakarta.persistence.Table
import kr.co.booktalk.AuditableLongIdEntity
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

@Entity
@Table(name = "book")
@EntityListeners(AuditingEntityListener::class)
class BookEntity(
    val isbn: String,

    val title: String,

    val author: String,

    val description: String? = null,

    val imageUrl: String? = null
) : AuditableLongIdEntity()

@Transactional(readOnly = true)
@Repository
interface BookRepository : JpaRepository<BookEntity, Long> {
    fun findByIsbn(isbn: String): BookEntity?
}
package kr.co.booktalk.domain

import jakarta.persistence.Column
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
    @Column(name = "isbn", nullable = false, unique = true, length = 20)
    val isbn: String,

    @Column(name = "title", nullable = false, length = 50)
    val title: String,

    @Column(name = "author", nullable = false, length = 50)
    val author: String,

    @Column(name = "description", nullable = true, length = 300)
    val description: String? = null,

    @Column(name = "imageUrl", nullable = true, length = 300)
    val imageUrl: String? = null
) : AuditableLongIdEntity()

@Transactional(readOnly = true)
@Repository
interface BookRepository : JpaRepository<BookEntity, Long> {
    fun findByIsbn(isbn: String): BookEntity?
}
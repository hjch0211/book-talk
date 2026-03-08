package kr.co.booktalk.domain

import jakarta.persistence.Entity
import jakarta.persistence.EntityListeners
import jakarta.persistence.Table
import kr.co.booktalk.AuditableLongIdEntity
import org.hibernate.annotations.SQLRestriction
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

@Entity
@Table(name = "book")
@EntityListeners(AuditingEntityListener::class)
@SQLRestriction("archived_at IS NULL")
class BookEntity(
    val isbn: String,

    val title: String,

    val author: String,

    val description: String? = null,

    val detailUrl: String,

    val imageUrl: String? = null
) : AuditableLongIdEntity()

@Transactional(readOnly = true)
@Repository
interface BookRepository : JpaRepository<BookEntity, Long> {
    fun findByIsbn(isbn: String): BookEntity?

    @Query("""
        SELECT b FROM BookEntity b
        WHERE LOWER(b.title) LIKE LOWER(CONCAT('%', :input, '%'))
        OR LOWER(b.author) LIKE LOWER(CONCAT('%', :input, '%'))
        ORDER BY b.author ASC
    """)
    fun findAllBySearch(@Param("input") input: String): List<BookEntity>

    fun findAllByOrderByAuthorAsc(): List<BookEntity>
}
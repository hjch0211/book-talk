package kr.co.booktalk.domain

import jakarta.persistence.*
import kr.co.booktalk.AuditableLongIdEntity
import kr.co.booktalk.AuditableUuidEntity
import org.springframework.data.jpa.domain.support.AuditingEntityListener
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import java.util.*

@Entity
@Table(name = "ai_chat_member")
@EntityListeners(AuditingEntityListener::class)
class AiChatMemberEntity(
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chat_id", nullable = false)
    val chat: AiChatEntity,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    val account: AccountEntity,
) : AuditableLongIdEntity()

@Transactional(readOnly = true)
@Repository
interface AiChatMemberRepository : JpaRepository<AiChatMemberEntity, Long> {
    fun findByChatId(chatId: UUID): AiChatMemberEntity?
    fun deleteAllByChat(chat: AiChatEntity)
}
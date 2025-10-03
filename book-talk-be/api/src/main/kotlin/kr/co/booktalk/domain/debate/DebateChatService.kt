package kr.co.booktalk.domain.debate

import kr.co.booktalk.domain.*
import kr.co.booktalk.domain.auth.AuthAccount
import kr.co.booktalk.httpBadRequest
import kr.co.booktalk.httpForbidden
import kr.co.booktalk.toUUID
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class DebateChatService(
    private val debateChatRepository: DebateChatRepository,
    private val debateRepository: DebateRepository,
    private val accountRepository: AccountRepository,
    private val debateMemberRepository: DebateMemberRepository
) {

    fun create(request: CreateChatRequest, authAccount: AuthAccount): CreateChatResponse {
        val debate = debateRepository.findByIdOrNull(request.debateId.toUUID())
            ?: httpBadRequest("토론을 찾을 수 없습니다.")
        if (debate.closedAt != null) httpBadRequest("종료된 토론입니다.")
        val account = accountRepository.findByIdOrNull(authAccount.id.toUUID())
            ?: httpBadRequest("계정을 찾을 수 없습니다.")
        val isMember = debateMemberRepository.existsByDebateAndAccount(debate, account)
        if (!isMember) httpForbidden("토론 참여자만 채팅을 보낼 수 있습니다.")
        val savedChat = debateChatRepository.save(
            DebateChatEntity(
                debate = debate,
                account = account,
                content = request.content
            )
        )

        return CreateChatResponse(
            id = savedChat.id,
            debateId = savedChat.debate.id.toString(),
            accountId = savedChat.account.id.toString(),
            accountName = savedChat.account.name,
            content = savedChat.content,
            createdAt = savedChat.createdAt
        )
    }

    @Transactional(readOnly = true)
    fun findByDebateId(debateId: String, authAccount: AuthAccount): List<ChatResponse> {
        val debate = debateRepository.findByIdOrNull(debateId.toUUID())
            ?: httpBadRequest("토론을 찾을 수 없습니다.")
        val account = accountRepository.findByIdOrNull(authAccount.id.toUUID())
            ?: httpBadRequest("계정을 찾을 수 없습니다.")
        val isMember = debateMemberRepository.existsByDebateAndAccount(debate, account)
        if (!isMember) httpForbidden("토론 참여자만 채팅을 조회할 수 있습니다.")

        val chats = debateChatRepository.findByDebateIdOrderByCreatedAt(debate.id!!)
        return chats.map { chat ->
            ChatResponse(
                id = chat.id,
                debateId = chat.debate.id.toString(),
                accountId = chat.account.id.toString(),
                accountName = chat.account.name,
                content = chat.content,
                createdAt = chat.createdAt
            )
        }
    }
}
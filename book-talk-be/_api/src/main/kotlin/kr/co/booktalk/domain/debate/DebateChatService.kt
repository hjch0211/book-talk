package kr.co.booktalk.domain.debate

import kr.co.booktalk.*
import kr.co.booktalk.cache.WebSocketSessionCache
import kr.co.booktalk.domain.*
import kr.co.booktalk.domain.auth.AuthAccount
import kr.co.booktalk.domain.webSocket.ChatRequest
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class DebateChatService(
    private val debateChatRepository: DebateChatRepository,
    private val debateRepository: DebateRepository,
    private val accountRepository: AccountRepository,
    private val debateMemberRepository: DebateMemberRepository,
    private val webSocketSessionCache: WebSocketSessionCache
) {
    fun create(request: ChatRequest) {
        val session = webSocketSessionCache.get(request.payload.accountId) ?: wsBadRequest("Session not found")

        val debate = debateRepository.findByIdOrNull(request.payload.debateId.toUUID())
            ?: wsBadRequest("토론을 찾을 수 없습니다.")
        if (debate.closedAt != null) wsBadRequest("종료된 토론입니다.")

        val account = accountRepository.findByIdOrNull(request.payload.accountId.toUUID())
            ?: wsBadRequest("계정을 찾을 수 없습니다.")

        if (!debateMemberRepository.existsByDebateAndAccountId(debate, account.id!!))
            wsForbidden("토론 참여자만 가능합니다.")

        val savedChat = debateChatRepository.save(
            DebateChatEntity(
                debate = debate,
                account = account,
                content = request.payload.content
            )
        )

        // TODO: 브로드캐스트 로직 추가
    }

    @Transactional(readOnly = true)
    fun findByDebateId(debateId: String, authAccount: AuthAccount): List<ChatResponse> {
        val debate = debateRepository.findByIdOrNull(debateId.toUUID())
            ?: httpBadRequest("토론을 찾을 수 없습니다.")
        val account = accountRepository.findByIdOrNull(authAccount.id.toUUID())
            ?: httpBadRequest("계정을 찾을 수 없습니다.")
        if (!debateMemberRepository.existsByDebateAndAccountId(debate, account.id!!))
            httpForbidden("토론 참여자만 가능합니다.")

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
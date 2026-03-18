package kr.co.booktalk.domain.aiChat

import kr.co.booktalk.domain.AccountRepository
import kr.co.booktalk.domain.AiChatEntity
import kr.co.booktalk.domain.AiChatMemberEntity
import kr.co.booktalk.domain.AiChatMemberRepository
import kr.co.booktalk.domain.AiChatMessageEntity
import kr.co.booktalk.domain.AiChatMessageRepository
import kr.co.booktalk.domain.AiChatPersonaRepository
import kr.co.booktalk.domain.AiChatRepository
import kr.co.booktalk.domain.DebateRepository
import kr.co.booktalk.domain.auth.AuthAccount
import kr.co.booktalk.httpBadRequest
import kr.co.booktalk.toUUID
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class AiChatService(
    private val aiChatRepository: AiChatRepository,
    private val aiChatMessageRepository: AiChatMessageRepository,
    private val aiChatPersonaRepository: AiChatPersonaRepository,
    private val debateRepository: DebateRepository,
    private val aiChatRealtimeService: AiChatRealtimeService,
    private val aiChatMemberRepository: AiChatMemberRepository,
    private val accountRepository: AccountRepository,
) {
    fun create(request: CreateAiChatRequest, authAccount: AuthAccount): CreateAiChatResponse {
        val debate = debateRepository.findByIdOrNull(request.debateId.toUUID())
            ?: httpBadRequest("토론을 찾을 수 없습니다.")
        val account = accountRepository.findByIdOrNull((authAccount.id).toUUID())
            ?: httpBadRequest("존재하지 않는 계정입니다.")

        val chat = aiChatRepository.saveAndFlush(AiChatEntity(debate = debate, personaId = request.persona))
        aiChatMemberRepository.save(AiChatMemberEntity(chat = chat, account = account))

        return CreateAiChatResponse(chatId = chat.id.toString())
    }

    @Transactional(readOnly = true)
    fun findOne(chatId: String, authAccount: AuthAccount): FindOneAiChatResponse {
        val chat = aiChatRepository.findByIdOrNull(chatId.toUUID())
            ?: httpBadRequest("채팅방을 찾을 수 없습니다.")
        val member = aiChatMemberRepository.findByChatId(chat.id!!)
            ?: httpBadRequest("채팅방 멤버를 찾을 수 없습니다.")
        if (member.account.id.toString() != authAccount.id) httpBadRequest("채팅방에 접근 권한이 없습니다.")
        val persona = aiChatPersonaRepository.findByIdOrNull(chat.personaId)
            ?: httpBadRequest("페르소나를 찾을 수 없습니다.")
        val messages = aiChatMessageRepository.findByChatIdOrderByCreatedAtAsc(chat.id!!)

        return FindOneAiChatResponse(
            chatId = chat.id.toString(),
            debateId = chat.debate.id.toString(),
            personaId = chat.personaId,
            agentId = persona.agentId,
            member = FindOneAiChatResponse.MemberInfo(
                accountId = member.account.id.toString(),
                accountName = member.account.name,
            ),
            messages = messages.map {
                FindOneAiChatResponse.MessageInfo(
                    id = it.id.toString(),
                    role = it.role,
                    content = it.content,
                    status = it.status.name,
                    createdAt = it.createdAt,
                )
            },
            createdAt = chat.createdAt,
        )
    }

    fun onUserMessageSaved(chatId: String) {
        val member = aiChatMemberRepository.findByChatId(chatId.toUUID())
            ?: httpBadRequest("채팅방 멤버를 찾을 수 없습니다.")
        aiChatRealtimeService.sendUserMessageSaved(chatId, member.account.id.toString())
    }

    fun remove(chatId: String) {
        val chat = aiChatRepository.findByIdOrNull(chatId.toUUID())
            ?: httpBadRequest("채팅방을 찾을 수 없습니다.")
        aiChatMessageRepository.deleteAllByChat(chat)
        aiChatMemberRepository.deleteAllByChat(chat)
        aiChatRepository.delete(chat)
    }

    fun saveChat(saveChatRequest: SaveChatRequest) {
        val chat = aiChatRepository.findByIdOrNull(saveChatRequest.chatId.toUUID())
            ?: httpBadRequest("채팅방을 찾을 수 없습니다.")
        aiChatMessageRepository.save(AiChatMessageEntity(
            chat = chat,
            role = saveChatRequest.role,
            content = saveChatRequest.message,
        ))
        aiChatRealtimeService.sendChatSaved(saveChatRequest.chatId, saveChatRequest.accountId)
    }
}

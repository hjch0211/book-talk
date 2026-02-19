package kr.co.booktalk.domain.aiChat

import io.github.oshai.kotlinlogging.KotlinLogging
import jakarta.annotation.PreDestroy
import kotlinx.coroutines.CoroutineName
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.launch
import kr.co.booktalk.client.AiChatClientRequest
import kr.co.booktalk.client.AiClient
import kr.co.booktalk.client.MonitorClient
import kr.co.booktalk.client.SendRequest
import kr.co.booktalk.coroutineGlobalExceptionHandler
import kr.co.booktalk.domain.AccountRepository
import kr.co.booktalk.domain.AiChatEntity
import kr.co.booktalk.domain.AiChatMemberEntity
import kr.co.booktalk.domain.AiChatMemberRepository
import kr.co.booktalk.domain.AiChatMessageRepository
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
    private val debateRepository: DebateRepository,
    private val aiChatRealtimeService: AiChatRealtimeService,
    private val aiClient: AiClient,
    private val monitorClient: MonitorClient,
    private val aiChatMemberRepository: AiChatMemberRepository,
    private val accountRepository: AccountRepository,
) {
    private val logger = KotlinLogging.logger {}
    private val scope = CoroutineScope(
        SupervisorJob() + Dispatchers.IO + CoroutineName("ai-chat-service") + coroutineGlobalExceptionHandler
    )

    @PreDestroy
    fun destroy() {
        scope.cancel()
    }

    fun create(request: CreateAiChatRequest, authAccount: AuthAccount): CreateAiChatResponse {
        val debate = debateRepository.findByIdOrNull(request.debateId.toUUID())
            ?: httpBadRequest("토론을 찾을 수 없습니다.")
        if (debate.closedAt != null) httpBadRequest("종료된 토론입니다.")
        val account = accountRepository.findByIdOrNull((authAccount.id).toUUID())
            ?: httpBadRequest("존재하지 않는 계정입니다.")

        val chat = aiChatRepository.saveAndFlush(AiChatEntity(debate = debate, persona = request.persona))
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
        val messages = aiChatMessageRepository.findByChatIdOrderByCreatedAtAsc(chat.id!!)

        return FindOneAiChatResponse(
            chatId = chat.id.toString(),
            debateId = chat.debate.id.toString(),
            persona = chat.persona,
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

    fun chat(request: AiChatRequest) {
        scope.launch {
            try {
                aiClient.chat(AiChatClientRequest(chatId = request.chatId, message = request.message))
            } catch (e: Exception) {
                logger.error(e) { "AI 채팅 실패 - ${e.message}" }
                monitorClient.send(
                    SendRequest(
                        title = "[book-talk-api] INTERNAL SERVER ERROR",
                        message = "${e.message}",
                        stackTrace = e.stackTraceToString(),
                        level = SendRequest.Level.ERROR
                    )
                )
            }
        }
    }

    fun onUserMessageSaved(chatId: String) {
        val member = aiChatMemberRepository.findByChatId(chatId.toUUID())
            ?: httpBadRequest("채팅방 멤버를 찾을 수 없습니다.")
        aiChatRealtimeService.sendUserMessageSaved(chatId, member.account.id.toString())
    }

    fun onChatCompleted(chatId: String) {
        val member = aiChatMemberRepository.findByChatId(chatId.toUUID())
            ?: httpBadRequest("채팅방 멤버를 찾을 수 없습니다.")
        aiChatRealtimeService.sendAiChatCompleted(chatId, member.account.id.toString())
    }

    fun remove(chatId: String) {
        val chat = aiChatRepository.findByIdOrNull(chatId.toUUID())
            ?: httpBadRequest("채팅방을 찾을 수 없습니다.")
        aiChatMessageRepository.deleteAllByChat(chat)
        aiChatMemberRepository.deleteAllByChat(chat)
        aiChatRepository.delete(chat)
    }
}

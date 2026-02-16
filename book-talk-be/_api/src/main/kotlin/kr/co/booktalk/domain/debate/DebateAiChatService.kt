package kr.co.booktalk.domain.debate

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
import kr.co.booktalk.domain.AiChatEntity
import kr.co.booktalk.domain.AiChatRepository
import kr.co.booktalk.domain.DebateRepository
import kr.co.booktalk.httpBadRequest
import kr.co.booktalk.toUUID
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class DebateAiChatService(
    private val aiChatRepository: AiChatRepository,
    private val debateRepository: DebateRepository,
    private val debateRealtimeService: DebateRealtimeService,
    private val aiClient: AiClient,
    private val monitorClient: MonitorClient,
) {
    private val logger = KotlinLogging.logger {}
    private val scope = CoroutineScope(
        SupervisorJob() + Dispatchers.IO + CoroutineName("debate-ai-chat-service") + coroutineGlobalExceptionHandler
    )

    @PreDestroy
    fun destroy() {
        scope.cancel()
    }

    fun create(request: CreateAiChatRequest): CreateAiChatResponse {
        val debate = debateRepository.findByIdOrNull(request.debateId.toUUID())
            ?: httpBadRequest("토론을 찾을 수 없습니다.")
        if (debate.closedAt != null) httpBadRequest("종료된 토론입니다.")

        val chat = aiChatRepository.save(
            AiChatEntity(
                debateId = request.debateId,
                persona = request.persona,
            )
        )

        return CreateAiChatResponse(chatId = chat.id.toString())
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

    fun onChatCompleted(chatId: String) {
        val chat = aiChatRepository.findByIdOrNull(chatId.toUUID())
            ?: httpBadRequest("채팅방을 찾을 수 없습니다.")
        debateRealtimeService.broadcastAiChatCompleted(chatId, chat.debateId!!)
    }

    fun remove(chatId: String) {
        val chat = aiChatRepository.findByIdOrNull(chatId.toUUID())
            ?: httpBadRequest("채팅방을 찾을 수 없습니다.")
        aiChatRepository.delete(chat)
    }
}
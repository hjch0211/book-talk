package kr.co.booktalk.domain.aiChat

import com.fasterxml.jackson.databind.ObjectMapper
import jakarta.annotation.PreDestroy
import kotlinx.coroutines.CoroutineName
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kr.co.booktalk.cache.WebSocketSessionCache
import kr.co.booktalk.client.MonitorClient
import kr.co.booktalk.coroutineGlobalExceptionHandler
import kr.co.booktalk.realtime.BaseRealtimeService
import org.springframework.stereotype.Service

@Service
class AiChatRealtimeService(
    webSocketSessionCache: WebSocketSessionCache,
    monitorClient: MonitorClient,
    objectMapper: ObjectMapper,
) : BaseRealtimeService(
    webSocketSessionCache = webSocketSessionCache,
    monitorClient = monitorClient,
    objectMapper = objectMapper,
    scope = CoroutineScope(
        SupervisorJob() + Dispatchers.IO + CoroutineName("ai-chat-realtime-service") + coroutineGlobalExceptionHandler
    ),
) {
    @PreDestroy
    fun destroy() {
        scope.cancel()
    }

    fun sendUserMessageSaved(chatId: String, accountId: String) {
        val response = UserMessageSavedResponse(
            payload = UserMessageSavedResponse.Payload(chatId = chatId)
        )
        sendToSession(accountId, objectMapper.writeValueAsString(response))
    }

    fun sendAiChatCompleted(chatId: String, accountId: String) {
        val response = AiChatCompletedResponse(
            payload = AiChatCompletedResponse.Payload(chatId = chatId)
        )
        sendToSession(accountId, objectMapper.writeValueAsString(response))
    }
}

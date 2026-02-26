package kr.co.booktalk.realtime

import com.fasterxml.jackson.databind.ObjectMapper
import io.github.oshai.kotlinlogging.KotlinLogging
import kr.co.booktalk.cache.WebSocketSessionCache
import kr.co.booktalk.client.MonitorClient
import kr.co.booktalk.client.SendRequest
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.launch
import org.springframework.web.socket.TextMessage
import org.springframework.web.socket.WebSocketSession

abstract class BaseRealtimeService(
    protected val webSocketSessionCache: WebSocketSessionCache,
    protected val monitorClient: MonitorClient,
    protected val objectMapper: ObjectMapper,
    protected val scope: CoroutineScope,
) {
    private val logger = KotlinLogging.logger {}

    fun sendToSession(accountId: String, messageJson: String) {
        val session = webSocketSessionCache.get(accountId)
        if (session != null) {
            sendTextMessage(session, messageJson)
        } else {
            logger.warn { "세션을 찾을 수 없음: accountId=$accountId, messageJson=$messageJson" }
        }
    }

    protected fun sendTextMessage(session: WebSocketSession, messageJson: String) {
        try {
            if (session.isOpen) {
                synchronized(session) {
                    if (session.isOpen) {
                        session.sendMessage(TextMessage(messageJson))
                    }
                }
            }
        } catch (e: Exception) {
            logger.error(e) { "메시지 전송 실패: sessionId=${session.id}" }
            scope.launch {
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
}

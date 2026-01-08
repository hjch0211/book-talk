package kr.co.booktalk

import io.github.oshai.kotlinlogging.KotlinLogging
import jakarta.annotation.PreDestroy
import kotlinx.coroutines.*
import kr.co.booktalk.client.MonitorClient
import kr.co.booktalk.client.SendRequest
import org.springframework.messaging.handler.annotation.MessageExceptionHandler
import org.springframework.web.bind.annotation.ControllerAdvice

@ControllerAdvice
class WebSocketExceptionHandler(
    private val monitorClient: MonitorClient
) {
    private val logger = KotlinLogging.logger {}
    private val scope = CoroutineScope(
        SupervisorJob() + Dispatchers.IO + CoroutineName("websocket-exception-monitor")
    )

    @PreDestroy
    fun destroy() {
        scope.cancel()
    }

    @MessageExceptionHandler(WebSocketException::class)
    fun handleWebSocketException(exception: WebSocketException) {
        if (exception.errorCode == "INTERNAL_SERVER_ERROR") {
            logger.error(exception) { "WebSocket 예외: ${exception.message}" }

            scope.launch {
                monitorClient.send(
                    SendRequest(
                        title = "[book-talk-api] WebSocket Internal Server Error",
                        message = "${exception.message}",
                        stackTrace = exception.stackTraceToString(),
                        level = SendRequest.Level.ERROR
                    )
                )
            }
        } else {
            logger.warn(exception) { "WebSocket 예외: ${exception.message}" }
        }
    }

    @MessageExceptionHandler(Exception::class)
    fun handleException(exception: Exception) {
        logger.error(exception) { "WebSocket 예외 발생: ${exception.message}" }

        scope.launch {
            monitorClient.send(
                SendRequest(
                    title = "[book-talk-api] WebSocket Internal Server Error",
                    message = "${exception.message}",
                    stackTrace = exception.stackTraceToString(),
                    level = SendRequest.Level.ERROR
                )
            )
        }
    }
}

class WebSocketException(
    val responseMessage: String,
    val errorCode: String? = null,
    message: String? = null,
    cause: Throwable? = null,
) : RuntimeException(message ?: responseMessage, cause)

fun wsBadRequest(message: String, cause: Throwable? = null, errorCode: String? = null): Nothing =
    throw WebSocketException(
        responseMessage = message,
        cause = cause,
        errorCode = errorCode
    )

fun wsUnauthorized(message: String, cause: Throwable? = null, errorCode: String? = null): Nothing =
    throw WebSocketException(
        responseMessage = message,
        cause = cause,
        errorCode = errorCode
    )

fun wsForbidden(message: String, cause: Throwable? = null, errorCode: String? = null): Nothing =
    throw WebSocketException(
        responseMessage = message,
        cause = cause,
        errorCode = errorCode
    )

fun wsInternalServerError(message: String = "Internal server error", cause: Throwable? = null): Nothing =
    throw WebSocketException(
        responseMessage = message,
        cause = cause,
        errorCode = "INTERNAL_SERVER_ERROR"
    )
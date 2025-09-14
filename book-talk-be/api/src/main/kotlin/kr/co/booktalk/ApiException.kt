package kr.co.booktalk

import io.github.oshai.kotlinlogging.KotlinLogging
import jakarta.servlet.http.HttpServletRequest
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice
import org.springframework.web.servlet.resource.NoResourceFoundException

@RestControllerAdvice
class GlobalExceptionHandler {
    private val logger = KotlinLogging.logger {}

    @ExceptionHandler(NoResourceFoundException::class)
    fun handle(e: NoResourceFoundException, request: HttpServletRequest): ResponseEntity<ApiResult<Unit>> {
        logger.warn(e) { "${request.method} ${request.requestURL} ${e.message}" }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(ApiResult(Unit, ApiResult.Error("No Resource Found")))
    }

    @ExceptionHandler(HttpException::class)
    fun handle(e: HttpException, request: HttpServletRequest): ResponseEntity<ApiResult<Unit>> {
        if (e.status.is5xxServerError) {
            logger.error(e) { "${request.method} ${request.requestURL} ${e.status} ${e.responseMessage}" }
        } else {
            logger.warn(e) { "${request.method} ${request.requestURL} ${e.status} ${e.responseMessage}" }
        }
        return ResponseEntity.status(e.status)
            .body(ApiResult(Unit, ApiResult.Error(e.responseMessage, e.errorCode)))
    }

    @ExceptionHandler(IllegalArgumentException::class)
    fun handle(e: IllegalArgumentException, request: HttpServletRequest): ResponseEntity<ApiResult<Unit>> {
        logger.warn(e) { "${request.method} ${request.requestURL} ${e.message}" }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(ApiResult(Unit, ApiResult.Error(e.message ?: "Bad Request")))
    }

    @ExceptionHandler(Exception::class)
    fun handle(e: Exception, request: HttpServletRequest): ResponseEntity<ApiResult<Unit>> {
        logger.error(e) { "${request.method} ${request.requestURL} ${e.message}" }
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(ApiResult(Unit, ApiResult.Error("Internal server error")))
    }
}

class HttpException(
    val status: HttpStatus,
    val responseMessage: String,
    val errorCode: String? = null,
    message: String? = null,
    cause: Throwable? = null,
) : RuntimeException(message?.let { "$status $it" } ?: status.toString(), cause)

enum class ErrorCode

fun httpBadRequest(message: String, cause: Throwable? = null, errorCode: ErrorCode? = null): Nothing =
    throw HttpException(
        status = HttpStatus.BAD_REQUEST,
        responseMessage = message,
        cause = cause,
        errorCode = errorCode?.name
    )

fun httpUnauthenticated(message: String, cause: Throwable? = null, errorCode: ErrorCode? = null): Nothing =
    throw HttpException(
        status = HttpStatus.UNAUTHORIZED,
        responseMessage = message,
        cause = cause,
        errorCode = errorCode?.name
    )

fun httpInternalServerError(cause: Throwable? = null, errorCode: ErrorCode? = null): Nothing =
    throw HttpException(
        status = HttpStatus.INTERNAL_SERVER_ERROR,
        responseMessage = "Internal server error",
        cause = cause,
        errorCode = errorCode?.name
    )
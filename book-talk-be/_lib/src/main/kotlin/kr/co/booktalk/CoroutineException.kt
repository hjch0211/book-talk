package kr.co.booktalk

import io.github.oshai.kotlinlogging.KotlinLogging
import kotlinx.coroutines.CoroutineExceptionHandler

/** Coroutine 전역 예외 핸들러 */
val coroutineGlobalExceptionHandler = CoroutineExceptionHandler { _, throwable ->
    val logger = KotlinLogging.logger {}
    logger.error(throwable) { "${throwable.message}\n${throwable.stackTraceToString()}" }
}

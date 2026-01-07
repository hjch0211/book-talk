package kr.co.booktalk

/** Message Queue Exception */
open class MQException(
    code: String,
    message: String,
    cause: Throwable? = null,
) : Exception("$code $message", cause)

/**
 * Temporally Network Error
 *
 * - requires retry
 */
class MQNetWorkErrorException(cause: Throwable? = null) :
    MQException("NETWORK_ERROR", "Temporally Network Error", cause)

fun mqNetworkError(cause: Throwable? = null): Nothing = throw MQNetWorkErrorException(cause)

/**
 * Invalid Message
 *
 * - requires discarding the message
 */
class MQInvalidMessageException(message: String, cause: Throwable? = null) :
    MQException("INVALID_MESSAGE", message, cause)

fun mqInvalidMessage(message: String, cause: Throwable? = null): Nothing =
    throw MQInvalidMessageException(message, cause)

/**
 * Internal Server Error
 *
 * - requires alert
 * - requires retry after handling
 */
class MQInternalServerErrorException(message: String, cause: Throwable? = null) :
    MQException("INTERNAL_SERVER_ERROR", message, cause)

fun mqInternalServerError(message: String, cause: Throwable? = null): Nothing =
    throw MQInternalServerErrorException(message, cause)
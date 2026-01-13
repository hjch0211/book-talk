package kr.co.booktalk

data class HttpResult<R>(
    val data: R,
    val error: Error? = null
) {
    data class Error(
        val message: String,
        /** 에러 코드 */
        val code: String? = null,
    )
}

/**
 * Converts object to [HttpResult]
 * All api endpoints must return [HttpResult].
 */
fun <R> R.toResult() = HttpResult(this)

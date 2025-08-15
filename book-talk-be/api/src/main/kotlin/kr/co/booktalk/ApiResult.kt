package kr.co.booktalk

data class ApiResult<R>(
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
 * Converts object to [ApiResult]
 * All api endpoints must return [ApiResult].
 */
fun <R> R.toResult() = ApiResult(this)

package kr.co.booktalk

interface WebSocketMessage<T> {
    /**
     * 메시지 타입
     *
     * From Browser: add C_ prefix
     * From Server: add S_ prefix
     */
    val type: String

    /** 페이로드 */
    val payload: T?
}
package kr.co.booktalk

abstract class WebSocketMessage<T> {
    /**
     * 메시지 타입
     *
     * From Browser: add C_ prefix
     * From Server: add S_ prefix
     */
    abstract val type: String

    /** 페이로드 */
    abstract val payload: T?
}
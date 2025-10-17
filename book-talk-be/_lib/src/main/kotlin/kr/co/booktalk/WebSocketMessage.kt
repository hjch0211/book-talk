package kr.co.booktalk

/**
 * WebSocket message
 *
 * From Client: add C_ prefix
 * From Server: add S_ prefix
 */
interface WebSocketMessage {
    val type: String
    val provider: Provider

    enum class Provider {
        CLIENT, API
    }
}
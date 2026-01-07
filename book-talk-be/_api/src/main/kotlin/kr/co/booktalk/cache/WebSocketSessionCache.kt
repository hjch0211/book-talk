package kr.co.booktalk.cache

import org.springframework.stereotype.Component
import org.springframework.web.socket.WebSocketSession
import java.util.concurrent.ConcurrentHashMap

/**
 * WebSocket Session Map (In-memory)
 *
 * @scope node - 노드가 각각 웹소켓 연결 관리
 */
@Component
class WebSocketSessionCache {
    /** accountId: WebSocketSession */
    private val sessions = ConcurrentHashMap<String, WebSocketSession>()

    fun get(accountId: String): WebSocketSession? =
        sessions[accountId]

    fun getAll(accountIds: Set<String>): Set<WebSocketSession> =
        accountIds.mapNotNull { sessions[it] }.toSet()

    fun add(accountId: String, session: WebSocketSession) {
        sessions[accountId] = session
    }

    fun remove(accountId: String) {
        sessions.remove(accountId)
    }
}
package kr.co.booktalk.domain.debate

import com.fasterxml.jackson.databind.ObjectMapper
import kr.co.booktalk.cache.HandRaiseCache
import kr.co.booktalk.cache.WebSocketSessionCache
import kr.co.booktalk.domain.webSocket.HandRaiseResponse
import kr.co.booktalk.domain.webSocket.ToggleHandRaiseRequest
import kr.co.booktalk.domain.webSocket.sendByMQ
import kr.co.booktalk.mqInvalidMessage
import org.springframework.stereotype.Service

/** 손들기 등 토론 활동 비즈니스 로직 처리 */
@Service
class DebateActivityService(
    private val webSocketSessionCache: WebSocketSessionCache,
    private val handRaiseCache: HandRaiseCache,
    private val objectMapper: ObjectMapper
) {
    /** "debate.request.toggle.hand" 이벤트 처리 */
    fun handleToggleHandEvent(payload: ToggleHandRaiseRequest.Payload) {
        webSocketSessionCache.get(payload.accountId) ?: mqInvalidMessage("Session not found")

        val raisedHands = handRaiseCache.get(payload.debateId)
        if (raisedHands.containsKey(payload.accountId)) {
            /** 손 내리기 */
            handRaiseCache.remove(payload.debateId, payload.accountId)
        } else {
            /** 손 들기 */
            handRaiseCache.add(payload.debateId, payload.accountId)
        }

        val updatedHands = handRaiseCache.get(payload.debateId)
        webSocketSessionCache
            .getAll(updatedHands.keys)
            .forEach { session ->
                session.sendByMQ(objectMapper.writeValueAsString(HandRaiseResponse.build(handRaiseCache.get(payload.debateId))))
            }
    }
}
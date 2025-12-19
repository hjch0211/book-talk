package kr.co.booktalk.cache

import org.springframework.stereotype.Component
import java.time.Duration

/** Redis 캐시 키 및 TTL 설정 */
@Component
class CacheProperties {

    // ============ WebSocket 세션 관련 ============
    val webSocketSession = WebSocketSessionProperties()

    class WebSocketSessionProperties {
        /** 토론방별 세션 목록 키 프리픽스 */
        private val debateSessionsKeyPrefix = "ws:debate:"
        private val debateSessionsKeySuffix = ":sessions"

        /** 세션 TTL (heartbeat 30초 간격 + 여유) */
        val sessionTtl: Duration = Duration.ofMinutes(35)

        /** ws:debate:{debateId}:sessions 키 생성 */
        fun debateSessionsKey(debateId: String): String =
            "$debateSessionsKeyPrefix$debateId$debateSessionsKeySuffix"
    }

    // ============ 손들기 관련 ============
    val handRaise = HandRaiseProperties()

    class HandRaiseProperties {
        /** 손들기 정보 키 프리픽스 */
        private val handsKeyPrefix = "debate:hands:"

        /** 손들기 자동 만료 시간 (3초 후 손 내리기 + 여유) */
        val handRaiseTtl: Duration = Duration.ofSeconds(5)

        /** debate:hands:{debateId} 키 생성 */
        fun handsKey(debateId: String): String = "$handsKeyPrefix$debateId"
    }
}
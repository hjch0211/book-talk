package kr.co.booktalk.presence

import com.fasterxml.jackson.databind.ObjectMapper
import io.github.oshai.kotlinlogging.KotlinLogging
import kr.co.booktalk.cache.CacheClient
import org.springframework.stereotype.Service
import java.time.Duration
import java.time.Instant

@Service
class PresenceService(
    private val cacheClient: CacheClient,
    private val objectMapper: ObjectMapper
) {
    private val logger = KotlinLogging.logger {}

    companion object {
        private const val DEBATE_PRESENCE_PREFIX = "presence:debate:"
        private const val USER_PRESENCE_PREFIX = "presence:user:"
        private const val DEFAULT_PRESENCE_TTL_SECONDS = 300L // 5분
    }

    fun joinDebate(debateId: String, userId: String, userName: String) {
        val debateKey = DEBATE_PRESENCE_PREFIX + debateId
        val userKey = USER_PRESENCE_PREFIX + userId
        val now = Instant.now()

        try {
            val userPresence = UserPresence(
                userId = userId,
                userName = userName,
                debateId = debateId,
                joinedAt = now,
                lastHeartbeat = now,
                status = PresenceStatus.ONLINE
            )

            // 사용자 개별 상태 저장
            val userPresenceJson = objectMapper.writeValueAsString(userPresence)
            cacheClient.set(userKey, userPresenceJson, Duration.ofSeconds(DEFAULT_PRESENCE_TTL_SECONDS))

            // 토론방 참여자 목록에 추가
            val currentUsers = getDebateUsers(debateId).toMutableSet()
            currentUsers.add(userPresence)

            val debatePresenceJson = objectMapper.writeValueAsString(currentUsers)
            cacheClient.set(debateKey, debatePresenceJson, Duration.ofSeconds(DEFAULT_PRESENCE_TTL_SECONDS))

            logger.info { "사용자 토론 참여: debateId=$debateId, userId=$userId" }
        } catch (e: Exception) {
            logger.error(e) { "사용자 토론 참여 처리 실패: debateId=$debateId, userId=$userId" }
        }
    }

    fun leaveDebate(debateId: String, userId: String) {
        val debateKey = DEBATE_PRESENCE_PREFIX + debateId
        val userKey = USER_PRESENCE_PREFIX + userId

        try {
            // 사용자 개별 상태 삭제
            cacheClient.delete(userKey)

            // 토론방 참여자 목록에서 제거
            val currentUsers = getDebateUsers(debateId).toMutableSet()
            currentUsers.removeAll { it.userId == userId }

            if (currentUsers.isNotEmpty()) {
                val debatePresenceJson = objectMapper.writeValueAsString(currentUsers)
                cacheClient.set(debateKey, debatePresenceJson, Duration.ofSeconds(DEFAULT_PRESENCE_TTL_SECONDS))
            } else {
                cacheClient.delete(debateKey)
            }

            logger.info { "사용자 토론 나감: debateId=$debateId, userId=$userId" }
        } catch (e: Exception) {
            logger.error(e) { "사용자 토론 나감 처리 실패: debateId=$debateId, userId=$userId" }
        }
    }

    fun updateHeartbeat(userId: String) {
        val userKey = USER_PRESENCE_PREFIX + userId

        try {
            cacheClient.get(userKey)?.let { userPresenceJson ->
                val userPresence = objectMapper.readValue(userPresenceJson, UserPresence::class.java)
                val updatedPresence = userPresence.copy(
                    lastHeartbeat = Instant.now(),
                    status = PresenceStatus.ONLINE
                )

                val updatedJson = objectMapper.writeValueAsString(updatedPresence)
                cacheClient.set(userKey, updatedJson, Duration.ofSeconds(DEFAULT_PRESENCE_TTL_SECONDS))

                // 토론방 참여자 목록도 업데이트
                val debateKey = DEBATE_PRESENCE_PREFIX + userPresence.debateId
                val currentUsers = getDebateUsers(userPresence.debateId).map { user ->
                    if (user.userId == userId) updatedPresence else user
                }.toSet()

                val debatePresenceJson = objectMapper.writeValueAsString(currentUsers)
                cacheClient.set(debateKey, debatePresenceJson, Duration.ofSeconds(DEFAULT_PRESENCE_TTL_SECONDS))
            }
        } catch (e: Exception) {
            logger.error(e) { "Heartbeat 업데이트 실패: userId=$userId" }
        }
    }

    fun getDebateUsers(debateId: String): Set<UserPresence> {
        val debateKey = DEBATE_PRESENCE_PREFIX + debateId

        return try {
            cacheClient.get(debateKey)?.let { debatePresenceJson ->
                val typeRef = objectMapper.typeFactory.constructCollectionType(Set::class.java, UserPresence::class.java)
                objectMapper.readValue<Set<UserPresence>>(debatePresenceJson, typeRef)
            } ?: emptySet()
        } catch (e: Exception) {
            logger.error(e) { "토론 참여자 목록 조회 실패: debateId=$debateId" }
            emptySet()
        }
    }

    fun getOnlineUsers(debateId: String): Set<UserPresence> {
        return getDebateUsers(debateId).filter { user ->
            val timeDiff = Duration.between(user.lastHeartbeat, Instant.now())
            timeDiff.seconds < 60 // 1분 이내 heartbeat가 있으면 온라인으로 간주
        }.toSet()
    }

    fun isUserOnline(userId: String): Boolean {
        val userKey = USER_PRESENCE_PREFIX + userId

        return try {
            cacheClient.get(userKey)?.let { userPresenceJson ->
                val userPresence = objectMapper.readValue(userPresenceJson, UserPresence::class.java)
                val timeDiff = Duration.between(userPresence.lastHeartbeat, Instant.now())
                timeDiff.seconds < 60
            } ?: false
        } catch (e: Exception) {
            logger.error(e) { "사용자 온라인 상태 확인 실패: userId=$userId" }
            false
        }
    }
}

data class UserPresence(
    val userId: String,
    val userName: String,
    val debateId: String,
    val joinedAt: Instant,
    val lastHeartbeat: Instant,
    val status: PresenceStatus
)

enum class PresenceStatus {
    ONLINE, AWAY, OFFLINE
}
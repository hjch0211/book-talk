package kr.co.booktalk.domain.presence

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
        private const val ACCOUNT_PRESENCE_PREFIX = "presence:account:"
        private const val DEFAULT_PRESENCE_TTL_SECONDS = 300L // 5분
    }

    fun joinDebate(debateId: String, accountId: String, accountName: String) {
        val debateKey = DEBATE_PRESENCE_PREFIX + debateId
        val accountKey = ACCOUNT_PRESENCE_PREFIX + accountId
        val now = Instant.now()

        try {
            val accountPresence = AccountPresence(
                accountId = accountId,
                accountName = accountName,
                debateId = debateId,
                joinedAt = now,
                lastHeartbeat = now,
                status = PresenceStatus.ONLINE
            )

            // 계정 개별 상태 저장
            val accountPresenceJson = objectMapper.writeValueAsString(accountPresence)
            cacheClient.set(accountKey, accountPresenceJson, Duration.ofSeconds(DEFAULT_PRESENCE_TTL_SECONDS))

            // 토론방 참여자 목록에 추가
            val currentAccounts = getDebateAccounts(debateId).toMutableSet()
            currentAccounts.add(accountPresence)

            val debatePresenceJson = objectMapper.writeValueAsString(currentAccounts)
            cacheClient.set(debateKey, debatePresenceJson, Duration.ofSeconds(DEFAULT_PRESENCE_TTL_SECONDS))

            logger.info { "계정 토론 참여: debateId=$debateId, accountId=$accountId" }
        } catch (e: Exception) {
            logger.error(e) { "계정 토론 참여 처리 실패: debateId=$debateId, accountId=$accountId" }
        }
    }

    fun leaveDebate(debateId: String, accountId: String) {
        val debateKey = DEBATE_PRESENCE_PREFIX + debateId
        val accountKey = ACCOUNT_PRESENCE_PREFIX + accountId

        try {
            // 계정 개별 상태 삭제
            cacheClient.delete(accountKey)

            // 토론방 참여자 목록에서 제거
            val currentAccounts = getDebateAccounts(debateId).toMutableSet()
            currentAccounts.removeAll { it.accountId == accountId }

            if (currentAccounts.isNotEmpty()) {
                val debatePresenceJson = objectMapper.writeValueAsString(currentAccounts)
                cacheClient.set(debateKey, debatePresenceJson, Duration.ofSeconds(DEFAULT_PRESENCE_TTL_SECONDS))
            } else {
                cacheClient.delete(debateKey)
            }

            logger.info { "계정 토론 나감: debateId=$debateId, accountId=$accountId" }
        } catch (e: Exception) {
            logger.error(e) { "계정 토론 나감 처리 실패: debateId=$debateId, accountId=$accountId" }
        }
    }

    fun updateHeartbeat(accountId: String) {
        val accountKey = ACCOUNT_PRESENCE_PREFIX + accountId

        try {
            cacheClient.get(accountKey)?.let { accountPresenceJson ->
                val accountPresence = objectMapper.readValue(accountPresenceJson, AccountPresence::class.java)
                val updatedPresence = accountPresence.copy(
                    lastHeartbeat = Instant.now(),
                    status = PresenceStatus.ONLINE
                )

                val updatedJson = objectMapper.writeValueAsString(updatedPresence)
                cacheClient.set(accountKey, updatedJson, Duration.ofSeconds(DEFAULT_PRESENCE_TTL_SECONDS))

                // 토론방 참여자 목록도 업데이트
                val debateKey = DEBATE_PRESENCE_PREFIX + accountPresence.debateId
                val currentAccounts = getDebateAccounts(accountPresence.debateId).map { account ->
                    if (account.accountId == accountId) updatedPresence else account
                }.toSet()

                val debatePresenceJson = objectMapper.writeValueAsString(currentAccounts)
                cacheClient.set(debateKey, debatePresenceJson, Duration.ofSeconds(DEFAULT_PRESENCE_TTL_SECONDS))
            }
        } catch (e: Exception) {
            logger.error(e) { "Heartbeat 업데이트 실패: accountId=$accountId" }
        }
    }

    fun getDebateAccounts(debateId: String): Set<AccountPresence> {
        val debateKey = DEBATE_PRESENCE_PREFIX + debateId

        return try {
            cacheClient.get(debateKey)?.let { debatePresenceJson ->
                val typeRef =
                    objectMapper.typeFactory.constructCollectionType(Set::class.java, AccountPresence::class.java)
                objectMapper.readValue<Set<AccountPresence>>(debatePresenceJson, typeRef)
            } ?: emptySet()
        } catch (e: Exception) {
            logger.error(e) { "토론 참여자 목록 조회 실패: debateId=$debateId" }
            emptySet()
        }
    }

    fun getOnlineAccounts(debateId: String): Set<AccountPresence> {
        return getDebateAccounts(debateId).filter { account ->
            val timeDiff = Duration.between(account.lastHeartbeat, Instant.now())
            timeDiff.seconds < 60 // 1분 이내 heartbeat가 있으면 온라인으로 간주
        }.toSet()
    }
}

data class AccountPresence(
    val accountId: String,
    val accountName: String,
    val debateId: String,
    val joinedAt: Instant,
    val lastHeartbeat: Instant,
    val status: PresenceStatus
)

enum class PresenceStatus {
    ONLINE, AWAY, OFFLINE
}
package kr.co.booktalk.domain.debate

import com.fasterxml.jackson.databind.ObjectMapper
import kr.co.booktalk.cache.AppConfigService
import kr.co.booktalk.domain.AccountRepository
import kr.co.booktalk.domain.DebateRepository
import kr.co.booktalk.domain.DebateRoundEntity
import kr.co.booktalk.domain.DebateRoundRepository
import kr.co.booktalk.domain.auth.AuthAccount
import kr.co.booktalk.domain.presence.PresenceWebSocketHandler
import kr.co.booktalk.httpBadRequest
import kr.co.booktalk.toUUID
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.Instant

@Service
class DebateRoundService(
    private val debateRepository: DebateRepository,
    private val accountRepository: AccountRepository,
    private val debateRoundRepository: DebateRoundRepository,
    private val appConfigService: AppConfigService,
    private val presenceWebSocketHandler: PresenceWebSocketHandler,
    private val objectMapper: ObjectMapper,
) {
    @Transactional
    fun create(request: CreateRoundRequest, authAccount: AuthAccount): CreateRoundResponse {
        val debate = debateRepository.findByIdOrNull(request.debateId.toUUID())
            ?: httpBadRequest("존재하지 않는 토론입니다.")

        // 이전 라운드가 있다면 종료 처리
        debateRoundRepository.findByDebateAndEndedAtIsNull(debate)?.let { existingRound ->
            existingRound.endedAt = Instant.now()
        }

        val debateRound = debateRoundRepository.saveAndFlush(request.toEntity(debate))

        // WebSocket을 통해 토론 라운드 업데이트 브로드캐스트
        broadcastDebateRoundUpdate(request.debateId, debateRound)

        return CreateRoundResponse(debateRound.id)
    }

    @Transactional
    fun patch(request: PatchRoundRequest, authAccount: AuthAccount) {
        val debateRound = debateRoundRepository.findByIdOrNull(request.debateRoundId)
            ?: httpBadRequest("존재하지 않는 톡서 토론 라운드입니다.")

        if (request.nextSpeakerId.isPresent) {
            debateRound.nextSpeaker = request.nextSpeakerId.value?.let { accountId ->
                accountRepository.findByIdOrNull(accountId.toUUID())
                    ?: httpBadRequest("존재하지 않는 계정입니다.")
            }
        }

        if (request.ended.isPresent && request.ended.value == true) {
            debateRound.endedAt = Instant.now()
        }
    }

    /** WebSocket을 통해 토론 라운드 업데이트를 브로드캐스트합니다. */
    private fun broadcastDebateRoundUpdate(
        debateId: String,
        debateRound: DebateRoundEntity,
    ) {
        try {
            val message = mapOf(
                "type" to "DEBATE_ROUND_UPDATE",
                "debateId" to debateId,
                "round" to mapOf(
                    "id" to debateRound.id,
                    "type" to debateRound.type.name,
                    "nextSpeakerId" to null,
                    "nextSpeakerName" to null,
                    "createdAt" to debateRound.createdAt.toEpochMilli(),
                    "endedAt" to debateRound.endedAt?.toEpochMilli()
                ),
                // SPEAKER_UPDATE 형태로도 함께 전송하여 currentSpeaker 설정
                "currentSpeaker" to mapOf(
                    "accountId" to null,
                    "accountName" to null,
                    "endedAt" to (System.currentTimeMillis() + appConfigService.debateRoundSpeakerSeconds() * 1000)
                )
            )

            val messageJson = objectMapper.writeValueAsString(message)
            presenceWebSocketHandler.broadcastToDebateRoom(debateId, messageJson)
        } catch (e: Exception) {
            // 브로드캐스트 실패는 로그만 남기고 메인 로직에는 영향 없도록 처리
            println("토론 라운드 브로드캐스트 실패: debateId=$debateId, error=${e.message}")
        }
    }


}
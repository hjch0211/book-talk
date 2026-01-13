package kr.co.booktalk.domain.debate

import com.fasterxml.jackson.databind.ObjectMapper
import kr.co.booktalk.config.AppProperties
import kr.co.booktalk.domain.AccountRepository
import kr.co.booktalk.domain.DebateRepository
import kr.co.booktalk.domain.DebateRoundEntity
import kr.co.booktalk.domain.DebateRoundRepository
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
    private val appProperties: AppProperties,
    private val debateWebSocketHandler: DebateWebSocketHandler,
    private val objectMapper: ObjectMapper,
) {
    @Transactional
    fun create(request: CreateRoundRequest): CreateRoundResponse {
        val debate = debateRepository.findByIdOrNull(request.debateId.toUUID())
            ?: httpBadRequest("존재하지 않는 토론입니다.")

        // 이전 라운드가 있다면 종료 처리
        debateRoundRepository.findByDebateIdAndEndedAtIsNull(debate.id!!)?.let { existingRound ->
            existingRound.endedAt = Instant.now()
        }

        val debateRound = debateRoundRepository.saveAndFlush(request.toEntity(debate))

        // WebSocket을 통해 토론 라운드 업데이트 브로드캐스트
        broadcastDebateRoundUpdate(request.debateId, debateRound)

        return CreateRoundResponse(debateRound.id)
    }

    @Transactional
    fun patch(request: PatchRoundRequest) {
        val debateRound = debateRoundRepository.findByIdOrNull(request.debateRoundId)
            ?: httpBadRequest("존재하지 않는 톡서 토론 라운드입니다.")

        if (request.nextSpeakerId?.isPresent == true) {
            debateRound.nextSpeaker = request.nextSpeakerId.get()?.let { accountId ->
                accountRepository.findByIdOrNull(accountId.toUUID())
                    ?: httpBadRequest("존재하지 않는 계정입니다.")
            }
        }

        if (request.ended?.isPresent == true && request.ended.get() == true) {
            debateRound.endedAt = Instant.now()
        }
    }

    /** WebSocket을 통해 토론 라운드 업데이트를 브로드캐스트합니다. */
    private fun broadcastDebateRoundUpdate(
        debateId: String,
        debateRound: DebateRoundEntity,
    ) {
        try {
            val response = DebateRoundUpdateResponse(
                payload = DebateRoundUpdateResponse.Payload(
                    debateId = debateId,
                    round = DebateRoundUpdateResponse.Payload.RoundInfo(
                        id = debateRound.id,
                        type = debateRound.type.name,
                        nextSpeakerId = null,
                        nextSpeakerName = null,
                        createdAt = debateRound.createdAt.toEpochMilli(),
                        endedAt = debateRound.endedAt?.toEpochMilli()
                    ),
                    currentSpeaker = DebateRoundUpdateResponse.Payload.CurrentSpeakerInfo(
                        accountId = null,
                        accountName = null,
                        endedAt = System.currentTimeMillis() + appProperties.debate.roundSpeakerSeconds * 1000
                    )
                )
            )

            val messageJson = objectMapper.writeValueAsString(response)
            debateWebSocketHandler.broadcastToDebateRoom(debateId, messageJson)
        } catch (e: Exception) {
            // 브로드캐스트 실패는 로그만 남기고 메인 로직에는 영향 없도록 처리
            println("토론 라운드 브로드캐스트 실패: debateId=$debateId, error=${e.message}")
        }
    }
}
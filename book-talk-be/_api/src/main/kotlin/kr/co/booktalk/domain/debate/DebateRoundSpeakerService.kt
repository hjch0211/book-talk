package kr.co.booktalk.domain.debate

import com.fasterxml.jackson.databind.ObjectMapper
import io.github.oshai.kotlinlogging.KotlinLogging
import kr.co.booktalk.cache.AppConfigService
import kr.co.booktalk.domain.*
import kr.co.booktalk.httpBadRequest
import kr.co.booktalk.httpForbidden
import kr.co.booktalk.toUUID
import org.openapitools.jackson.nullable.JsonNullable
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.Instant

@Service
class DebateRoundSpeakerService(
    private val accountRepository: AccountRepository,
    private val debateRoundSpeakerRepository: DebateRoundSpeakerRepository,
    private val debateRoundRepository: DebateRoundRepository,
    private val appConfigService: AppConfigService,
    private val debateMemberRepository: DebateMemberRepository,
    private val objectMapper: ObjectMapper,
    private val debateWebSocketHandler: DebateWebSocketHandler,
    private val debateRoundService: DebateRoundService
) {
    private val logger = KotlinLogging.logger {}

    @Transactional
    fun create(request: CreateRoundSpeakerRequest) {
        val debateRound = debateRoundRepository.findByIdOrNull(request.debateRoundId)
            ?: httpBadRequest("존재하지 않는 토론 라운드입니다.")
        val speaker = accountRepository.findByIdOrNull(request.nextSpeakerId.toUUID())
            ?: httpBadRequest("존재하지 않는 계정입니다.")
        if (!debateMemberRepository.existsByDebateAndAccountId(debateRound.debate, speaker.id!!))
            httpForbidden("토론 참여자만 가능합니다.")

        // 현재 활성 발언자가 있다면 종료 처리
        val currentSpeaker = debateRoundSpeakerRepository.findByDebateRoundAndIsActive(debateRound, true)
        currentSpeaker?.let {
            it.endedAt = Instant.now()
            it.isActive = false
            debateRoundSpeakerRepository.save(it)
        }

        // 새로운 발언자 생성
        debateRoundSpeakerRepository.save(
            DebateRoundSpeakerEntity(
                account = speaker,
                debateRound = debateRound,
                endedAt = Instant.now().plusSeconds(appConfigService.debateRoundSpeakerSeconds()),
                isActive = true
            )
        )
        logger.info { "새 발언자 생성: accountId=${speaker.id}, debateRoundId=${debateRound.id}" }

        // WebSocket으로 발표자 정보 브로드캐스트
        val debateId = debateRound.debate.id.toString()
        broadcastSpeakerUpdate(debateId)
    }

    @Transactional
    fun patch(request: PatchRoundSpeakerRequest) {
        val speaker = debateRoundSpeakerRepository.findByIdOrNull(request.debateRoundSpeakerId)
            ?: httpBadRequest("존재하지 않는 토론 발언자입니다.")

        var updated = false

        request.extension?.takeIf { it }?.let {
            speaker.endedAt = speaker.endedAt.plusSeconds(appConfigService.debateRoundSpeakerSeconds())
            updated = true
        }
        request.ended?.takeIf { it }?.let {
            speaker.endedAt = Instant.now()
            speaker.isActive = false
            updated = true
        }

        if (updated) {
            val debateId = speaker.debateRound.debate.id.toString()

            if (speaker.debateRound.type == DebateRoundType.PRESENTATION) {
                setNextSpeaker(speaker)
            }

            broadcastSpeakerUpdate(debateId)
        }
    }

    /**
     * PRESENTATION 라운드에서 발언 종료 시 다음 발표자 설정
     * - 다음 발표자가 있으면 새 발표자 생성 및 대기 발표자 설정
     * - 마지막 발표자면 FREE 라운드로 전환
     */
    private fun setNextSpeaker(currentSpeaker: DebateRoundSpeakerEntity) {
        val round = currentSpeaker.debateRound
        val debate = round.debate

        val members = debateMemberRepository.findAllByDebateOrderByCreatedAtAsc(debate)
        if (members.isEmpty()) return

        val currentIndex = members.indexOfFirst { it.account.id == currentSpeaker.account.id }
        if (currentIndex == -1) return

        // 마지막 발표자인 경우 FREE 라운드로 전환
        if (currentIndex >= members.size - 1) {
            logger.info { "마지막 발표자 종료, FREE 라운드로 전환: debateId=${debate.id}" }
            val freeRound = debateRoundService.create(CreateRoundRequest(debate.id.toString(), DebateRoundType.FREE))
            val freeRoundEntity = debateRoundRepository.findByIdOrNull(freeRound.id)!!
            val firstSpeaker = members[0].account
            debateRoundSpeakerRepository.save(
                DebateRoundSpeakerEntity(
                    account = firstSpeaker,
                    debateRound = freeRoundEntity,
                    endedAt = Instant.now().plusSeconds(appConfigService.debateRoundSpeakerSeconds()),
                    isActive = true
                )
            )
            logger.info { "FREE 라운드 첫 발언자 생성: accountId=${firstSpeaker.id}, debateRoundId=${freeRoundEntity.id}" }
            return
        }

        // 다음 발표자 생성
        val nextSpeaker = members[currentIndex + 1].account
        debateRoundSpeakerRepository.save(
            DebateRoundSpeakerEntity(
                account = nextSpeaker,
                debateRound = round,
                endedAt = Instant.now().plusSeconds(appConfigService.debateRoundSpeakerSeconds()),
                isActive = true
            )
        )
        logger.info { "다음 발표자 생성: accountId=${nextSpeaker.id}, debateRoundId=${round.id}" }

        // 다음 발표자 예약
        val nextWaitingSpeakerId = if (currentIndex < members.size - 2) {
            members[currentIndex + 2].account.id?.toString()
        } else {
            null
        }
        debateRoundService.patch(
            PatchRoundRequest(
                debateRoundId = round.id,
                nextSpeakerId = JsonNullable.of(nextWaitingSpeakerId)
            )
        )
    }

    /** 현재 발표자 정보를 조회합니다 */
    fun getCurrentSpeaker(debateId: String): SpeakerUpdateResponse? {
        return try {
            val debateUUID = java.util.UUID.fromString(debateId)
            val currentRound = debateRoundRepository.findByDebateIdAndEndedAtIsNull(debateUUID)
                ?: return null

            val currentSpeaker = debateRoundSpeakerRepository.findByDebateRoundAndIsActive(currentRound, true)
                ?: return null

            SpeakerUpdateResponse(
                payload = SpeakerUpdateResponse.SpeakerUpdatePayload(
                    debateId = debateId,
                    currentSpeaker = SpeakerUpdateResponse.SpeakerUpdatePayload.CurrentSpeakerInfo(
                        accountId = currentSpeaker.account.id.toString(),
                        accountName = currentSpeaker.account.name,
                        endedAt = currentSpeaker.endedAt.toEpochMilli()
                    ),
                    nextSpeaker = currentRound.nextSpeaker?.let {
                        SpeakerUpdateResponse.SpeakerUpdatePayload.NextSpeakerInfo(
                            accountId = it.id.toString(),
                            accountName = it.name
                        )
                    }
                )
            )
        } catch (e: Exception) {
            logger.error(e) { "현재 발표자 정보 조회 실패: debateId=$debateId" }
            null
        }
    }

    /** 발표자 정보 변경을 해당 토론방의 모든 WebSocket 클라이언트에게 직접 브로드캐스트합니다 */
    private fun broadcastSpeakerUpdate(debateId: String) {
        try {
            val response = getCurrentSpeaker(debateId) ?: return

            // 해당 토론방의 모든 WebSocket 세션에 직접 브로드캐스트
            val messageJson = objectMapper.writeValueAsString(response)
            debateWebSocketHandler.broadcastToDebateRoom(debateId, messageJson)

            logger.info { "발표자 정보 브로드캐스트 완료: debateId=$debateId" }
        } catch (e: Exception) {
            logger.error(e) { "발표자 정보 브로드캐스트 실패: debateId=$debateId" }
        }
    }
}

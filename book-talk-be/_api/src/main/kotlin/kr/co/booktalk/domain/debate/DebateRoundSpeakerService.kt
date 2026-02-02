package kr.co.booktalk.domain.debate

import io.github.oshai.kotlinlogging.KotlinLogging
import kr.co.booktalk.config.AppProperties
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
    private val appProperties: AppProperties,
    private val debateMemberRepository: DebateMemberRepository,
    private val debateRealtimeService: DebateRealtimeService,
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

        debateRoundSpeakerRepository.save(
            DebateRoundSpeakerEntity(
                account = speaker,
                debateRound = debateRound,
                endedAt = Instant.now().plusSeconds(appProperties.debate.roundSpeakerSeconds),
                isActive = true
            )
        )
        val debateId = debateRound.debate.id.toString()
        getCurrentSpeaker(debateId)?.let { debateRealtimeService.broadcastSpeakerUpdate(debateId, it) }
    }

    @Transactional
    fun patch(request: PatchRoundSpeakerRequest) {
        val speaker = debateRoundSpeakerRepository.findByIdOrNull(request.debateRoundSpeakerId)
            ?: httpBadRequest("존재하지 않는 토론 발언자입니다.")

        var updated = false

        request.extension?.takeIf { it }?.let {
            speaker.endedAt = speaker.endedAt.plusSeconds(appProperties.debate.roundSpeakerSeconds)
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

            getCurrentSpeaker(debateId)?.let { debateRealtimeService.broadcastSpeakerUpdate(debateId, it) }
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
            val freeRound = debateRoundService.create(CreateRoundRequest(debate.id.toString(), DebateRoundType.FREE))
            val freeRoundEntity = debateRoundRepository.findByIdOrNull(freeRound.id)!!
            val firstSpeaker = members[0].account
            debateRoundSpeakerRepository.save(
                DebateRoundSpeakerEntity(
                    account = firstSpeaker,
                    debateRound = freeRoundEntity,
                    endedAt = Instant.now().plusSeconds(appProperties.debate.roundSpeakerSeconds),
                    isActive = true
                )
            )
            return
        }

        // 다음 발표자 생성
        val nextSpeaker = members[currentIndex + 1].account
        debateRoundSpeakerRepository.save(
            DebateRoundSpeakerEntity(
                account = nextSpeaker,
                debateRound = round,
                endedAt = Instant.now().plusSeconds(appProperties.debate.roundSpeakerSeconds),
                isActive = true
            )
        )

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

    fun getCurrentSpeaker(debateId: String): SpeakerUpdateResponse? {
        return try {
            val debateUUID = java.util.UUID.fromString(debateId)
            val currentRound = debateRoundRepository.findByDebateIdAndEndedAtIsNull(debateUUID)
                ?: return null

            val currentSpeaker = debateRoundSpeakerRepository.findByDebateRoundAndIsActive(currentRound, true)
                ?: return null

            SpeakerUpdateResponse(
                payload = SpeakerUpdateResponse.Payload(
                    debateId = debateId,
                    currentSpeaker = SpeakerUpdateResponse.Payload.CurrentSpeakerInfo(
                        accountId = currentSpeaker.account.id.toString(),
                        accountName = currentSpeaker.account.name,
                        endedAt = currentSpeaker.endedAt.toEpochMilli()
                    ),
                    nextSpeaker = currentRound.nextSpeaker?.let {
                        SpeakerUpdateResponse.Payload.NextSpeakerInfo(
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
}

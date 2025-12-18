package kr.co.booktalk.domain.debate

import io.github.oshai.kotlinlogging.KotlinLogging
import kr.co.booktalk.domain.DebateMemberRepository
import kr.co.booktalk.domain.DebateRoundSpeakerRepository
import kr.co.booktalk.domain.DebateRoundType
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional
import java.time.Instant

@Component
class DebateScheduler(
    private val debateRoundSpeakerRepository: DebateRoundSpeakerRepository,
    private val debateMemberRepository: DebateMemberRepository,
    private val debateRoundService: DebateRoundService,
    private val debateRoundSpeakerService: DebateRoundSpeakerService,
    private val debateService: DebateService,
) {
    private val logger = KotlinLogging.logger {}

    /**
     * PRESENTATION 라운드 핸들링
     * - 다음 발표자 설정
     * - Free 라운드 설정
     * transaction latency: 0.03 ~ 0.05s
     */
    @Scheduled(fixedDelay = 1000)
    fun handlePresentationRound() {
        val expiredSpeakers = debateRoundSpeakerRepository
            .findAllByIsActiveTrueAndEndedAtBeforeAndDebateRoundTypeAndDebateRoundEndedAtIsNull(
                Instant.now(),
                DebateRoundType.PRESENTATION
            )
        if (expiredSpeakers.isEmpty()) return

        expiredSpeakers.forEach { speaker ->
            try {
                val debate = speaker.debateRound.debate
                val members = debateMemberRepository.findAllByDebateOrderByCreatedAtAsc(debate)
                val currentIndex = members.indexOfFirst { it.account.id == speaker.account.id }

                val hasNextSpeaker = currentIndex != -1 && currentIndex < members.size - 1
                if (hasNextSpeaker) {
                    /** 다음 발표자가 있으면 → 다음 발표자 설정 */
                    debateService.setNextSpeaker(speaker)
                } else {
                    /** 마지막 발표자면 → FREE 라운드 생성 */
                    val firstSpeakerId = members.firstOrNull()?.account?.id?.toString()
                    val roundResponse = debateRoundService.create(
                        CreateRoundRequest(debate.id.toString(), DebateRoundType.FREE)
                    )
                    if (firstSpeakerId != null) {
                        debateRoundSpeakerService.create(
                            CreateRoundSpeakerRequest(roundResponse.id, firstSpeakerId)
                        )
                    }
                }
            } catch (e: Exception) {
                logger.error(e) { "발표자 만료 처리 실패: speakerId=${speaker.id}, accountId=${speaker.account.id}, debateId=${speaker.debateRound.debate.id}" }
            }
        }
    }

    /** 매일 0시에 생성된 지 24시간이 지난 토론 자동 종료 */
    @Scheduled(cron = "0 0 0 * * *")
    @Transactional
    fun closeExpiredDebates() {
        try {
            debateService.closeExpiredDebates()
        } catch (e: Exception) {
            logger.error(e) { "토론 자동 종료 처리 실패" }
        }
    }
}
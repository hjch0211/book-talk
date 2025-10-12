package kr.co.booktalk.domain.debate

import io.github.oshai.kotlinlogging.KotlinLogging
import kr.co.booktalk.domain.DebateRoundSpeakerRepository
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional
import java.time.Instant

@Component
class DebateScheduler(
    private val debateRoundSpeakerRepository: DebateRoundSpeakerRepository,
    private val debateService: DebateService,
) {
    private val logger = KotlinLogging.logger {}

    /** 1초마다 만료된 발표자 체크 및 자동 전환 */
    @Scheduled(fixedDelay = 1000)
    fun checkExpiredSpeakers() {
        val expiredSpeakers = debateRoundSpeakerRepository.findAllByIsActiveAndEndedAtBefore(true, Instant.now())
        if (expiredSpeakers.isEmpty()) return

        expiredSpeakers.forEach { speaker ->
            try {
                debateService.handleExpiredSpeaker(speaker)
            } catch (e: Exception) {
                logger.error(e) { "발표자 만료 처리 실패: speakerId=${speaker.id}, accountId=${speaker.account.id}, debateId=${speaker.debateRound.debate.id}" }
            }
        }
    }

    /** 24시간마다 생성된 지 24시간이 지난 토론 자동 종료 */
    @Scheduled(fixedDelay = 24 * 60 * 60 * 1000)
    @Transactional
    fun closeExpiredDebates() {
        try {
            debateService.closeExpiredDebates()
        } catch (e: Exception) {
            logger.error(e) { "토론 자동 종료 처리 실패" }
        }
    }
}

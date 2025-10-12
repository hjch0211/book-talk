package kr.co.booktalk.domain.debate

import io.github.oshai.kotlinlogging.KotlinLogging
import kr.co.booktalk.domain.DebateRoundSpeakerRepository
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional
import java.time.Instant

/**
 * 토론 자동 진행 스케줄러
 *
 * 1초마다 실행되어 만료된 발표자를 감지하고 자동으로 다음 발표자로 전환합니다.
 * 비즈니스 로직은 DebateService.handleExpiredSpeaker()에 위임합니다.
 */
@Component
class DebateScheduler(
    private val debateRoundSpeakerRepository: DebateRoundSpeakerRepository,
    private val debateService: DebateService,
    private val debateRoundSpeakerService: DebateRoundSpeakerService,
    private val debateRoundService: DebateRoundService,
) {
    private val logger = KotlinLogging.logger {}

    /** 1초마다 만료된 발표자 체크 및 자동 전환 */
    @Scheduled(fixedDelay = 1000)
    @Transactional
    fun checkExpiredSpeakers() {
        val expiredSpeakers = debateRoundSpeakerRepository
            .findAllByIsActiveAndEndedAtBefore(true, Instant.now())

        if (expiredSpeakers.isEmpty()) return

        expiredSpeakers.forEach { speaker ->
            try {
                debateService.handleExpiredSpeaker(
                    speaker = speaker,
                    debateRoundSpeakerService = debateRoundSpeakerService,
                    debateRoundService = debateRoundService
                )
            } catch (e: Exception) {
                logger.error(e) {
                    "발표자 만료 처리 실패: speakerId=${speaker.id}, " +
                            "accountId=${speaker.account.id}, " +
                            "debateId=${speaker.debateRound.debate.id}"
                }
            }
        }
    }
}

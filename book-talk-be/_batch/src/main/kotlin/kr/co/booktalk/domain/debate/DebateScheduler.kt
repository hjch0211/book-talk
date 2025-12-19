package kr.co.booktalk.domain.debate

import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional

@Component
class DebateScheduler(
    private val debateService: DebateService,
) {
    private val logger = KotlinLogging.logger {}

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
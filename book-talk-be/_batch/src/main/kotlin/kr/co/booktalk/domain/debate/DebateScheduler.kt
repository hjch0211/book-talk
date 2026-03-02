package kr.co.booktalk.domain.debate

import io.github.oshai.kotlinlogging.KotlinLogging
import jakarta.annotation.PreDestroy
import kotlinx.coroutines.*
import kr.co.booktalk.client.MonitorClient
import kr.co.booktalk.client.SendRequest
import kr.co.booktalk.coroutineGlobalExceptionHandler
import kr.co.booktalk.domain.DebateRepository
import kr.co.booktalk.domain.DebateRoundRepository
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional
import java.time.Instant

@Component
class DebateScheduler(
    private val monitorClient: MonitorClient,
    private val debateRepository: DebateRepository,
    private val debateRoundRepository: DebateRoundRepository
) {
    private val logger = KotlinLogging.logger {}
    private val scope = CoroutineScope(
        SupervisorJob() + Dispatchers.IO + CoroutineName("debate-scheduler") + coroutineGlobalExceptionHandler
    )

    @PreDestroy
    fun destroy() {
        scope.cancel()
    }

    /** 매일 0시에 생성된 지 1주일이 지난 토론 자동 종료 */
    @Scheduled(cron = "0 0 0 * * *")
    @Transactional
    fun closeExpiredDebates() {
        try {
            val expiredDebates = debateRepository.findAllByCreatedAtBeforeAndClosedAtIsNull(
                Instant.now().minusSeconds(7 * 24 * 60 * 60)
            )
            if (expiredDebates.isEmpty()) return

            expiredDebates.forEach { debate ->
                debate.closedAt = Instant.now()
                debateRoundRepository.findByDebateIdAndEndedAtIsNull(debate.id!!)?.let { currentRound ->
                    currentRound.endedAt = Instant.now()
                }
            }
        } catch (e: Exception) {
            logger.error(e) { "토론 자동 종료 처리 실패" }
            scope.launch {
                monitorClient.send(
                    SendRequest(
                        title = "[book-talk-batch] BATCH JOB ERROR",
                        message = "${e.message}",
                        stackTrace = e.stackTraceToString(),
                        level = SendRequest.Level.ERROR
                    )
                )
            }
        }
    }
}
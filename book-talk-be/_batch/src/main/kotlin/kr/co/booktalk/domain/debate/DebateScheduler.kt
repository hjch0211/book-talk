package kr.co.booktalk.domain.debate

import io.github.oshai.kotlinlogging.KotlinLogging
import kotlinx.coroutines.*
import kr.co.booktalk.client.MonitorClient
import kr.co.booktalk.client.SendRequest
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional

@Component
class DebateScheduler(
    private val debateService: DebateService,
    private val monitorClient: MonitorClient
) {
    private val logger = KotlinLogging.logger {}
    private val scope = CoroutineScope(
        SupervisorJob() + Dispatchers.IO + CoroutineName("debate-scheduler")
    )

    /** 매일 0시에 생성된 지 24시간이 지난 토론 자동 종료 */
    @Scheduled(cron = "0 0 0 * * *")
    @Transactional
    fun closeExpiredDebates() {
        try {
            debateService.closeExpiredDebates()
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
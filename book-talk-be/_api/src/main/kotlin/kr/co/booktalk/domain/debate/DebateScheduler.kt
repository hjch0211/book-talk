package kr.co.booktalk.domain.debate

import io.github.oshai.kotlinlogging.KotlinLogging
import jakarta.annotation.PreDestroy
import kotlinx.coroutines.*
import kr.co.booktalk.client.MonitorClient
import kr.co.booktalk.client.SendRequest
import kr.co.booktalk.domain.DebateRoundSpeakerRepository
import kr.co.booktalk.domain.DebateRoundType
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import java.time.Instant

/**
 * 토론 관련 스케줄러
 *
 * TODO: 추후 batch 서버로 옮길것 (웹소켓 브로드캐스트를 위한 로직 필요)
 */
@Component
class DebateScheduler(
    private val debateRoundSpeakerRepository: DebateRoundSpeakerRepository,
    private val debateRoundSpeakerService: DebateRoundSpeakerService,
    private val monitorClient: MonitorClient
) {
    private val logger = KotlinLogging.logger {}
    private val scope = CoroutineScope(
        SupervisorJob() + Dispatchers.IO + CoroutineName("debate-scheduler")
    )

    @PreDestroy
    fun destroy() {
        scope.cancel()
    }

    /**
     * PRESENTATION 라운드 핸들링
     * - 만료된 발표자 종료 → patch(ended=true) 호출
     * - 다음 발표자 설정 또는 FREE 라운드 전환은 patch 내부에서 처리
     * - transaction latency: 0.03 ~ 0.05s
     *
     * TODO: 추후 batch 서버로 옮길것 (웹소켓 브로드캐스트를 위한 로직 필요)
     */
    @Scheduled(fixedDelay = 1000)
    fun handlePresentationRound() {
        val expiredSpeakers = debateRoundSpeakerRepository
            .findAllByIsActiveTrueAndEndedAtBeforeAndDebateRoundTypeAndDebateRoundEndedAtIsNull(
                Instant.now(),
                DebateRoundType.PRESENTATION
            ).ifEmpty { return }

        expiredSpeakers.forEach { speaker ->
            runCatching {
                debateRoundSpeakerService.patch(
                    PatchRoundSpeakerRequest(
                        debateRoundSpeakerId = speaker.id,
                        ended = true
                    )
                )
            }.onFailure { e ->
                logger.error(e) { "발표자 만료 처리 실패: speakerId=${speaker.id}, accountId=${speaker.account.id}, debateId=${speaker.debateRound.debate.id}" }
                scope.launch {
                    monitorClient.send(
                        SendRequest(
                            title = "[book-talk-api] BATCH JOB ERROR",
                            message = "${e.message}",
                            stackTrace = e.stackTraceToString(),
                            level = SendRequest.Level.ERROR
                        )
                    )
                }
            }
        }
    }
}

package kr.co.booktalk.domain.debate

import io.github.oshai.kotlinlogging.KotlinLogging
import jakarta.annotation.PreDestroy
import kotlinx.coroutines.*
import kr.co.booktalk.client.MailClient
import kr.co.booktalk.client.MonitorClient
import kr.co.booktalk.client.SendMailRequest
import kr.co.booktalk.client.SendRequest
import kr.co.booktalk.coroutineGlobalExceptionHandler
import kr.co.booktalk.domain.DebateMemberRepository
import kr.co.booktalk.domain.DebateNotificationRepository
import kr.co.booktalk.domain.DebateRepository
import kr.co.booktalk.domain.DebateRoundRepository
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional
import java.time.Instant
import java.time.ZoneId
import java.time.format.DateTimeFormatter

@Component
class DebateScheduler(
    private val monitorClient: MonitorClient,
    private val mailClient: MailClient,
    private val debateRepository: DebateRepository,
    private val debateRoundRepository: DebateRoundRepository,
    private val debateMemberRepository: DebateMemberRepository,
    private val debateNotificationRepository: DebateNotificationRepository,
) {
    private val kst = ZoneId.of("Asia/Seoul")
    private val dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy년 MM월 dd일 HH:mm").withZone(kst)
    private val logger = KotlinLogging.logger {}
    private val scope = CoroutineScope(
        SupervisorJob() + Dispatchers.IO + CoroutineName("debate-scheduler") + coroutineGlobalExceptionHandler
    )

    @PreDestroy
    fun destroy() {
        scope.cancel()
    }

    /** 59초마다 토론 시작 전 이메일 리마인더 발송 */
    @Scheduled(fixedDelay = 59000)
    @Transactional
    fun sendDebateReminders() {
        try {
            val pending = debateNotificationRepository.findAllPending(Instant.now())
            if (pending.isEmpty()) return

            val debates = pending.map { it.debate }.distinctBy { it.id }
            val members = debateMemberRepository.findAllByDebateIn(debates)
            val membersByDebate = members.groupBy { it.debate.id }

            for (notification in pending) {
                val debate = notification.debate
                val debateMembers = membersByDebate[debate.id] ?: continue
                val label = notificationLabel(debate.startAt, notification.scheduledAt)
                val startAtFormatted = dateTimeFormatter.format(debate.startAt)

                debateMembers.forEach { member ->
                    scope.launch {
                        try {
                            mailClient.send(
                                SendMailRequest(
                                    to = member.account.email,
                                    subject = "[BookTalk] 토론 시작 $label 전 알림",
                                    html = buildReminderHtml(debate.topic, startAtFormatted, label),
                                )
                            )
                        } catch (e: Exception) {
                            logger.error(e) { "토론 리마인더 메일 발송 실패: debateId=${debate.id}, to=${member.account.email}" }
                        }
                    }
                }

                notification.isCompleted = true
            }
        } catch (e: Exception) {
            logger.error(e) { "토론 리마인더 스케줄러 실패" }
            scope.launch {
                monitorClient.send(
                    SendRequest(
                        title = "[book-talk-batch] REMINDER JOB ERROR",
                        message = "${e.message}",
                        stackTrace = e.stackTraceToString(),
                        level = SendRequest.Level.ERROR
                    )
                )
            }
        }
    }

    private fun notificationLabel(startAt: Instant, scheduledAt: Instant): String {
        val diffSeconds = startAt.epochSecond - scheduledAt.epochSecond
        return when {
            diffSeconds >= 3 * 24 * 3600 - 60 -> "3일"
            diffSeconds >= 2 * 24 * 3600 - 60 -> "2일"
            diffSeconds >= 24 * 3600 - 60      -> "1일"
            else                               -> "1시간"
        }
    }

    private fun buildReminderHtml(topic: String, startAt: String, label: String): String {
        return """<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><title>토론 시작 $label 전 알림</title></head><body style="margin:0;padding:0;background-color:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="padding:24px 0;"><tr><td align="center"><table role="presentation" width="480" cellspacing="0" cellpadding="0" border="0" style="max-width:480px;background-color:#ffffff;border-radius:8px;box-shadow:0 6px 18px rgba(0,0,0,.06);padding:32px 28px 28px;"><tr><td align="center" style="padding:0 0 16px 0;"><h1 style="margin:0;font-size:20px;font-weight:700;color:#111827;">토론 시작 $label 전입니다</h1></td></tr><tr><td align="center" style="padding:0 0 24px 0;"><p style="margin:0;font-size:14px;line-height:1.6;color:#4b5563;">참여 중인 토론이 곧 시작됩니다. 잊지 말고 참여해 주세요!</p></td></tr><tr><td style="padding:0 0 16px 0;"><div style="background-color:#f9fafb;border-radius:8px;border:1px solid #e5e7eb;padding:20px 24px;"><p style="margin:0 0 8px 0;font-size:13px;color:#9ca3af;font-weight:500;">토론 주제</p><p style="margin:0 0 16px 0;font-size:16px;font-weight:600;color:#111827;">$topic</p><p style="margin:0 0 8px 0;font-size:13px;color:#9ca3af;font-weight:500;">시작 일시</p><p style="margin:0;font-size:16px;font-weight:600;color:#111827;">$startAt</p></div></td></tr><tr><td align="center"><p style="margin:0;font-size:12px;color:#9ca3af;">본인이 참여하지 않은 토론이라면, 이 메일을 무시하셔도 됩니다.</p></td></tr></table></td></tr></table></body></html>"""
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
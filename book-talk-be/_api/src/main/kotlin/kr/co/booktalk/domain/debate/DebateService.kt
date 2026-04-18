package kr.co.booktalk.domain.debate

import io.github.oshai.kotlinlogging.KotlinLogging
import jakarta.annotation.PreDestroy
import kotlinx.coroutines.CoroutineName
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.launch
import kr.co.booktalk.config.AppProperties
import kr.co.booktalk.client.AiClient
import kr.co.booktalk.client.MailClient
import kr.co.booktalk.client.MonitorClient
import kr.co.booktalk.client.SendMailRequest
import kr.co.booktalk.client.SendRequest
import kr.co.booktalk.client.SummarizeRequest
import kr.co.booktalk.coroutineGlobalExceptionHandler
import kr.co.booktalk.domain.*
import kr.co.booktalk.domain.auth.AuthAccount
import kr.co.booktalk.httpBadRequest
import kr.co.booktalk.httpForbidden
import kr.co.booktalk.toUUID
import org.openapitools.jackson.nullable.JsonNullable
import org.springframework.data.domain.PageRequest
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.Instant
import java.time.temporal.ChronoUnit

@Service
class DebateService(
    private val accountRepository: AccountRepository,
    private val debateRepository: DebateRepository,
    private val debateMemberRepository: DebateMemberRepository,
    private val debateRoundRepository: DebateRoundRepository,
    private val presentationRepository: PresentationRepository,
    private val debateRoundSpeakerRepository: DebateRoundSpeakerRepository,
    private val debateRoundSpeakerService: DebateRoundSpeakerService,
    private val debateRoundService: DebateRoundService,
    private val bookRepository: BookRepository,
    private val aiClient: AiClient,
    private val debateSummarizationRepository: DebateSummarizationRepository,
    private val debateChatRepository: DebateChatRepository,
    private val aiChatRepository: AiChatRepository,
    private val aiChatMessageRepository: AiChatMessageRepository,
    private val monitorClient: MonitorClient,
    private val mailClient: MailClient,
    private val debateRealtimeService: DebateRealtimeService,
    private val debateNotificationRepository: DebateNotificationRepository,
    private val appProperties: AppProperties,
) {
    private val logger = KotlinLogging.logger {}
    private val scope = CoroutineScope(
        SupervisorJob() + Dispatchers.IO + CoroutineName("debate-service") + coroutineGlobalExceptionHandler
    )

    @PreDestroy
    fun destroy() {
        scope.cancel()
    }

    @Transactional
    fun create(request: CreateRequest, authAccount: AuthAccount): CreateResponse {
        val host = accountRepository.findByIdOrNull(authAccount.id.toUUID()) ?: httpBadRequest("존재하지 않는 사용자입니다.")
        val book = bookRepository.findByIsbn(request.bookISBN) ?: bookRepository.save(
            BookEntity(
                isbn = request.bookISBN,
                title = request.bookTitle,
                author = request.bookAuthor,
                description = request.bookDescription?.trim()?.take(5000),
                detailUrl= request.detailUrl,
                imageUrl = request.bookImageUrl
            )
        )

        val debate = debateRepository.saveAndFlush(request.toEntity(host, book))
        debateMemberRepository.save(
            DebateMemberEntity(
                account = host,
                debate = debate,
                role = DebateMemberRole.HOST
            )
        )
        presentationRepository.save(PresentationEntity(debate, host, "{}"))
        debateRoundService.create(CreateRoundRequest(debate.id.toString(), DebateRoundType.PREPARATION))

        val notificationOffsets = listOf(
            3 * 24 * 3600L, // 3일 전
            2 * 24 * 3600L, // 2일 전
            24 * 3600L,     // 1일 전
            3600L,          // 1시간 전
        )
        notificationOffsets.forEach { offsetSeconds ->
            val scheduledAt = debate.startAt.minusSeconds(offsetSeconds)
            if (scheduledAt.isAfter(Instant.now())) {
                debateNotificationRepository.save(DebateNotificationEntity(debate = debate, scheduledAt = scheduledAt))
            }
        }

        return CreateResponse(debate.id.toString())
    }

    fun findAll(request: FindAllRequest): FindAllResponse {
        val books = if (request.keyword.isNullOrBlank()) bookRepository.findAllByOrderByAuthorAsc()
                    else bookRepository.findAllBySearch(request.keyword)
        if (books.isEmpty()) return FindAllResponse(page = org.springframework.data.domain.Page.empty())

        val debates = debateRepository.findAllWithFilters(
            books = books,
            hostId = request.hostId?.toUUID(),
            canJoin = request.canJoin,
            pageable = PageRequest.of(request.page, request.size),
        )
        val membersMap = debateMemberRepository.findAllByDebateIn(debates.content)
            .groupBy { it.debate.id }

        return FindAllResponse(
            page = debates.map { it.toDebateInfo(membersMap[it.id] ?: emptyList()) }
        )
    }

    fun findOneSummarized(id: String): FindOneSummarizedResponse {
        val debate = debateRepository.findByIdOrNull(id.toUUID())
            ?: httpBadRequest("존재하지 않는 토론방입니다.")
        return debate.toSummarizedResponse()
    }

    @Transactional
    fun cancelJoin(debateId: String, authAccount: AuthAccount) {
        val account = accountRepository.findByIdOrNull(authAccount.id.toUUID()) ?: httpBadRequest("존재하지 않는 사용자입니다.")
        val debate = debateRepository.findByIdOrNull(debateId.toUUID()) ?: httpBadRequest("존재하지 않는 토론입니다.")

        val member = debateMemberRepository.findByDebateAndAccountForUpdate(debate, account) ?: httpBadRequest("토론 참여자가 아닙니다.")
        if (member.role == DebateMemberRole.HOST) httpBadRequest("방장은 참여를 취소할 수 없습니다.")

        debateMemberRepository.delete(member)
        presentationRepository.deleteByDebateAndAccount(debate, account)
    }

    fun findOne(id: String): FindOneResponse {
        val debate = debateRepository.findByIdOrNull(id.toUUID())
            ?: httpBadRequest("존재하지 않는 토론방입니다.")
        val members = debateMemberRepository.findAllByDebateOrderByCreatedAtAsc(debate)
        val presentations = presentationRepository.findAllByDebateOrderByCreatedAtAsc(debate)
        val currentRound = debateRoundRepository.findByDebateIdAndEndedAtIsNull(debate.id!!)
        val currentSpeaker = currentRound
            ?.let { debateRoundSpeakerRepository.findByDebateRoundAndIsActive(it, true) }
        val currentSpeakerId = currentSpeaker?.id
        val currentSpeakerAccountId = currentSpeaker?.account?.id?.toString()
        val currentSpeakerEndedAt = currentSpeaker?.endedAt
        val aiSummarized = debateSummarizationRepository.findByDebateId(debate.id!!)

        return debate.toResponse(members, presentations, currentRound, currentSpeakerId, currentSpeakerAccountId, currentSpeakerEndedAt, aiSummarized?.content)
    }

    @Transactional
    fun join(request: JoinRequest, authAccount: AuthAccount) {
        val account = accountRepository.findByIdOrNull(authAccount.id.toUUID()) ?: httpBadRequest("존재하지 않는 사용자입니다.")
        val debate = debateRepository.findByIdForUpdate(request.debateId.toUUID())
            ?.validateJoinable()
            ?: httpBadRequest("존재하지 않는 토론입니다.")
        if (debateMemberRepository.countByDebate(debate) > debate.maxMemberCount) {
            httpBadRequest("토론방의 최대 정원(${debate.maxMemberCount}명)을 초과했습니다.")
        }

        debateMemberRepository.save(
            DebateMemberEntity(
                account = account,
                debate = debate,
                role = DebateMemberRole.MEMBER
            )
        )

        presentationRepository.save(PresentationEntity(debate, account, "{}"))
        notifyDebateJoined(debate, account)
    }

    @Transactional
    fun update(request: UpdateRequest) {
        val debate = debateRepository.findByIdOrNull(request.debateId.toUUID())
            ?: httpBadRequest("존재하지 않는 토론방입니다.")
        val members = debateMemberRepository.findAllByDebateOrderByCreatedAtAsc(debate)
        if (members.isEmpty()) httpBadRequest("토론 참여자가 없습니다.")

        val now = Instant.now()

        /** 토론 정보 수정 */
        if (!request.ended && debate.startAt.isAfter(now)) {
            if (debate.closedAt != null) httpBadRequest("종료된 토론의 정보는 수정할 수 없습니다.")
            if (request.startAt.isBefore(now)) httpBadRequest("토론 시작 시간은 현재 시간 이후여야 합니다.")
            debate.topic = request.topic
            debate.description = request.description
            debate.maxMemberCount = request.maxMemberCount
            debate.startAt = request.startAt
            debateNotificationRepository.deleteAllByDebate(debate)
            val notificationOffsets = listOf(
                3 * 24 * 3600L, // 3일 전
                2 * 24 * 3600L, // 2일 전
                24 * 3600L,     // 1일 전
                3600L,          // 1시간 전
            )
            notificationOffsets.forEach { offsetSeconds ->
                val scheduledAt = debate.startAt.minusSeconds(offsetSeconds)
                if (scheduledAt.isAfter(now)) {
                    debateNotificationRepository.save(DebateNotificationEntity(debate = debate, scheduledAt = scheduledAt))
                }
            }
            notifyDebateUpdated(members, debate)
        }

        val currentRound = debateRoundRepository.findByDebateIdAndEndedAtIsNull(debate.id!!)
        val currentRoundType = currentRound?.type

        /** 토론 라운드 처리 */
        when {
            /** 동일 라운드 타입 요청 → 무시 */
            currentRoundType != null && request.roundType.name == currentRoundType.name -> null

            /** PREPARATION 이후 단계(PRESENTATION/FREE)에서 PRESENTATION 재요청 → 불가 */
            currentRoundType != DebateRoundType.PREPARATION && request.roundType == UpdateRequest.RoundType.PRESENTATION ->
                httpBadRequest("이미 라운드가 시작되었습니다.")

            /** PRESENTATION이 아닌 상태에서 FREE 전환 요청 → 불가 (PREPARATION → FREE 포함) */
            currentRoundType != DebateRoundType.PRESENTATION && request.roundType == UpdateRequest.RoundType.FREE ->
                httpBadRequest("PRESENTATION 라운드에서만 FREE 라운드로 전환할 수 있습니다.")

            /** PREPARATION → PRESENTATION: 첫 번째 발언자 지정 및 다음 발언자 예약 */
            currentRoundType == DebateRoundType.PREPARATION && request.roundType == UpdateRequest.RoundType.PRESENTATION -> {
                val newRound = debateRoundService.create(
                    CreateRoundRequest(debate.id.toString(), DebateRoundType.PRESENTATION)
                )
                val firstSpeakerId = members[0].account.id.toString()
                debateRoundSpeakerService.create(CreateRoundSpeakerRequest(newRound.id, firstSpeakerId))

                val nextSpeakerId = if (members.size > 1) members[1].account.id.toString() else null
                debateRoundService.patch(PatchRoundRequest(newRound.id, JsonNullable.of(nextSpeakerId)))
            }

            /** PRESENTATION → FREE: 첫 번째 발언자 지정 (이후 순서는 스케줄러가 처리) */
            currentRoundType != DebateRoundType.FREE && request.roundType == UpdateRequest.RoundType.FREE -> {
                val newRound = debateRoundService.create(
                    CreateRoundRequest(debate.id.toString(), DebateRoundType.FREE)
                )
                val firstSpeakerId = members[0].account.id.toString()
                debateRoundSpeakerService.create(CreateRoundSpeakerRequest(newRound.id, firstSpeakerId))
            }
        }

        /** 토론 종료 처리 */
        when {
            !request.ended -> null

            debate.closedAt != null -> httpBadRequest("이미 종료된 토론입니다.")

            currentRoundType != null -> {
                currentRound.nextSpeaker = null
                currentRound.endedAt = Instant.now()
                debate.closedAt = Instant.now()
                debateRealtimeService.broadcastDebateRoundUpdate(request.debateId, currentRound)
            }
        }
    }

    @Transactional
    fun archive(debateId: String, authAccount: AuthAccount) {
        val account = accountRepository.findByIdOrNull(authAccount.id.toUUID()) ?: httpBadRequest("존재하지 않는 사용자입니다.")
        val debate = debateRepository.findByIdOrNull(debateId.toUUID()) ?: httpBadRequest("존재하지 않는 토론방입니다.")
        val members = debateMemberRepository.findAllByDebateOrderByCreatedAtAsc(debate)
        val member = debateMemberRepository.findByDebateAndAccountForUpdate(debate, account) ?: httpBadRequest("토론 참여자가 아닙니다.")
        if (member.role != DebateMemberRole.HOST) httpForbidden("방장만 토론방을 삭제할 수 있습니다.")

        val now = Instant.now()
        aiChatMessageRepository.archiveAllByDebate(debate, now)
        aiChatRepository.archiveAllByDebate(debate, now)
        debateRoundSpeakerRepository.archiveAllByDebate(debate, now)
        debateRoundRepository.archiveAllByDebate(debate, now)
        debateChatRepository.archiveAllByDebate(debate, now)
        presentationRepository.archiveAllByDebate(debate, now)
        debateSummarizationRepository.archiveAllByDebate(debate, now)
        debateNotificationRepository.deleteAllByDebate(debate)
        debateMemberRepository.archiveAllByDebate(debate, now)
        debate.archivedAt = now
        notifyDebateDeleted(members, debate)
    }

    private fun notifyDebateJoined(debate: DebateEntity, joinedAccount: AccountEntity) {
        val debateUrl = "${appProperties.frontendUrl}/debate/${debate.id}"
        scope.launch {
            try {
                mailClient.send(
                    SendMailRequest(
                        to = debate.host.email,
                        subject = "[BookTalk] 토론에 새 참여자가 들어왔습니다",
                        html = """<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><title>새 참여자 알림</title></head><body style="margin:0;padding:0;background-color:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="padding:24px 0;"><tr><td align="center"><table role="presentation" width="480" cellspacing="0" cellpadding="0" border="0" style="max-width:480px;background-color:#ffffff;border-radius:8px;box-shadow:0 6px 18px rgba(0,0,0,.06);padding:32px 28px 28px;"><tr><td align="center" style="padding:0 0 16px 0;"><h1 style="margin:0;font-size:20px;font-weight:700;color:#111827;">새 참여자 알림</h1></td></tr><tr><td style="padding:0 0 20px 0;"><p style="margin:0;font-size:14px;line-height:1.6;color:#4b5563;"><strong>${joinedAccount.name}</strong>님이 토론에 참여했습니다.</p></td></tr><tr><td style="background-color:#f9fafb;border-radius:8px;padding:16px 20px;"><p style="margin:0 0 8px 0;font-size:13px;color:#6b7280;">토론 주제</p><p style="margin:0;font-size:15px;font-weight:600;color:#111827;">${debate.topic}</p></td></tr><tr><td align="center" style="padding:24px 0 0 0;"><a href="$debateUrl" style="display:inline-block;padding:12px 24px;background-color:#111827;color:#ffffff;text-decoration:none;border-radius:6px;font-size:14px;font-weight:600;">토론방 바로가기</a></td></tr></table></td></tr></table></body></html>""",
                    )
                )
            } catch (e: Exception) {
                logger.error(e) { "새 참여자 이메일 발송 실패 - debateId=${debate.id}, joinedAccountId=${joinedAccount.id}" }
            }
        }
    }

    private fun notifyDebateUpdated(members: List<DebateMemberEntity>, debate: DebateEntity) {
        val kst = debate.startAt.atZone(java.time.ZoneId.of("Asia/Seoul"))
        val startAtKst = "${kst.year}.${kst.monthValue.toString().padStart(2, '0')}.${kst.dayOfMonth.toString().padStart(2, '0')} ${kst.hour}시${if (kst.minute != 0) " ${kst.minute}분" else ""}"
        val debateUrl = "${appProperties.frontendUrl}/debate/${debate.id}"
        scope.launch {
            members
                .filter { it.role != DebateMemberRole.HOST }
                .forEach { member ->
                    try {
                        mailClient.send(
                            SendMailRequest(
                                to = member.account.email,
                                subject = "[BookTalk] 참여 중인 토론 정보가 변경되었습니다",
                                html = """<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><title>토론 정보 변경 안내</title></head><body style="margin:0;padding:0;background-color:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="padding:24px 0;"><tr><td align="center"><table role="presentation" width="480" cellspacing="0" cellpadding="0" border="0" style="max-width:480px;background-color:#ffffff;border-radius:8px;box-shadow:0 6px 18px rgba(0,0,0,.06);padding:32px 28px 28px;"><tr><td align="center" style="padding:0 0 16px 0;"><h1 style="margin:0;font-size:20px;font-weight:700;color:#111827;">토론 정보 변경 안내</h1></td></tr><tr><td style="padding:0 0 20px 0;"><p style="margin:0;font-size:14px;line-height:1.6;color:#4b5563;">참여 중인 토론의 정보가 변경되었습니다.</p></td></tr><tr><td style="padding:0 0 20px 0;background-color:#f9fafb;border-radius:8px;padding:16px 20px;"><p style="margin:0 0 8px 0;font-size:13px;color:#6b7280;">토론 주제</p><p style="margin:0;font-size:15px;font-weight:600;color:#111827;">${debate.topic}</p></td></tr><tr><td style="padding:12px 0 0 0;"><table width="100%" cellspacing="0" cellpadding="0" border="0"><tr><td style="padding:4px 0;font-size:13px;color:#6b7280;">토론 일정</td><td style="padding:4px 0;font-size:13px;color:#111827;text-align:right;">$startAtKst</td></tr><tr><td style="padding:4px 0;font-size:13px;color:#6b7280;">모집 인원</td><td style="padding:4px 0;font-size:13px;color:#111827;text-align:right;">${debate.maxMemberCount}명</td></tr></table></td></tr><tr><td align="center" style="padding:24px 0 0 0;"><a href="$debateUrl" style="display:inline-block;padding:12px 24px;background-color:#111827;color:#ffffff;text-decoration:none;border-radius:6px;font-size:14px;font-weight:600;">토론방 바로가기</a></td></tr><tr><td align="center" style="padding:16px 0 0 0;"><p style="margin:0;font-size:12px;color:#9ca3af;">본인이 참여하지 않은 토론이라면 이 메일을 무시하셔도 됩니다.</p></td></tr></table></td></tr></table></body></html>""",
                            )
                        )
                    } catch (e: Exception) {
                        logger.error(e) { "토론 정보 변경 이메일 발송 실패 - memberId=${member.account.id}" }
                    }
                }
        }
    }

    private fun notifyDebateDeleted(members: List<DebateMemberEntity>, debate: DebateEntity) {
        scope.launch {
            members
                .filter { it.role != DebateMemberRole.HOST }
                .forEach { member ->
                    try {
                        mailClient.send(
                            SendMailRequest(
                                to = member.account.email,
                                subject = "[BookTalk] 참여 중인 토론방이 삭제되었습니다",
                                html = """<!DOCTYPE html><html lang="ko"><head><meta charset="UTF-8"><title>토론방 삭제 안내</title></head><body style="margin:0;padding:0;background-color:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;"><table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="padding:24px 0;"><tr><td align="center"><table role="presentation" width="480" cellspacing="0" cellpadding="0" border="0" style="max-width:480px;background-color:#ffffff;border-radius:8px;box-shadow:0 6px 18px rgba(0,0,0,.06);padding:32px 28px 28px;"><tr><td align="center" style="padding:0 0 16px 0;"><h1 style="margin:0;font-size:20px;font-weight:700;color:#111827;">토론방 삭제 안내</h1></td></tr><tr><td style="padding:0 0 20px 0;"><p style="margin:0;font-size:14px;line-height:1.6;color:#4b5563;">참여 중이던 토론방이 방장에 의해 삭제되었습니다.</p></td></tr><tr><td style="background-color:#f9fafb;border-radius:8px;padding:16px 20px;"><p style="margin:0 0 8px 0;font-size:13px;color:#6b7280;">토론 주제</p><p style="margin:0;font-size:15px;font-weight:600;color:#111827;">${debate.topic}</p></td></tr><tr><td align="center" style="padding:24px 0 0 0;"><a href="${appProperties.frontendUrl}" style="display:inline-block;padding:12px 24px;background-color:#111827;color:#ffffff;text-decoration:none;border-radius:6px;font-size:14px;font-weight:600;">BookTalk 바로가기</a></td></tr><tr><td align="center" style="padding:16px 0 0 0;"><p style="margin:0;font-size:12px;color:#9ca3af;">본인이 참여하지 않은 토론이라면 이 메일을 무시하셔도 됩니다.</p></td></tr></table></td></tr></table></body></html>""",
                            )
                        )
                    } catch (e: Exception) {
                        logger.error(e) { "토론 삭제 이메일 발송 실패 - memberId=${member.account.id}" }
                    }
                }
        }
    }

    fun summarizeDebate(debateId: String) {
        scope.launch {
            try {
                aiClient.summarizeDebate(SummarizeRequest(debateId))
            } catch (e: Exception) {
                logger.error(e) {"토론 요약 실패 - ${e.message}"}
                monitorClient.send(
                    SendRequest(
                        title = "[book-talk-api] INTERNAL SERVER ERROR",
                        message = "${e.message}",
                        stackTrace = e.stackTraceToString(),
                        level = SendRequest.Level.ERROR
                    )
                )
            }
        }
    }
}
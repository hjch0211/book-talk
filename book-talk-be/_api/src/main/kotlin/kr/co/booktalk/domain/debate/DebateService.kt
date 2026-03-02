package kr.co.booktalk.domain.debate

import io.github.oshai.kotlinlogging.KotlinLogging
import jakarta.annotation.PreDestroy
import kotlinx.coroutines.CoroutineName
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.launch
import kr.co.booktalk.client.AiClient
import kr.co.booktalk.client.MonitorClient
import kr.co.booktalk.client.SendRequest
import kr.co.booktalk.client.SummarizeRequest
import kr.co.booktalk.coroutineGlobalExceptionHandler
import kr.co.booktalk.domain.*
import kr.co.booktalk.domain.auth.AuthAccount
import kr.co.booktalk.httpBadRequest
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
    private val monitorClient: MonitorClient,
    private val debateRealtimeService: DebateRealtimeService
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
        return CreateResponse(debate.id.toString())
    }

    fun findAll(request: FindAllRequest): FindAllResponse {
        val books = if (request.keyword.isNullOrBlank()) bookRepository.findAllByOrderByAuthorAsc()
                    else bookRepository.findAllBySearch(request.keyword)
        if (books.isEmpty()) return FindAllResponse(page = org.springframework.data.domain.Page.empty())

        val debates = debateRepository.findAllWithFilters(
            books = books,
            accountId = request.accountId?.toUUID(),
            roundType = request.round,
            pageable = PageRequest.of(request.page, request.size),
        )
        val membersMap = debateMemberRepository.findAllByDebateIn(debates.content)
            .groupBy { it.debate.id }

        return FindAllResponse(
            page = debates.map { it.toDebateInfo(membersMap[it.id] ?: emptyList()) }
        )
    }

    @Transactional
    fun cancelJoin(debateId: String, authAccount: AuthAccount) {
        val account = accountRepository.findByIdOrNull(authAccount.id.toUUID()) ?: httpBadRequest("존재하지 않는 사용자입니다.")
        val debate = debateRepository.findByIdOrNull(debateId.toUUID()) ?: httpBadRequest("존재하지 않는 토론입니다.")

        val currentRound = debateRoundRepository.findByDebateIdAndEndedAtIsNull(debate.id!!)
        if (currentRound?.type != DebateRoundType.PREPARATION) httpBadRequest("PREPARATION 단계에서만 참여를 취소할 수 있습니다.")

        if (debate.startAt < Instant.now().plus(3, ChronoUnit.DAYS)) {
            httpBadRequest("토론 시작 3일 전부터는 참여를 취소할 수 없습니다.")
        }

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
        val debate = debateRepository.findByIdOrNull(request.debateId.toUUID())
            ?.validateJoinable()
            ?: httpBadRequest("존재하지 않는 토론입니다.")
        if (debateMemberRepository.countByDebateForUpdate(debate) >= debate.maxMemberCount) {
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
    }

    @Transactional
    fun update(request: UpdateRequest) {
        val debate = debateRepository.findByIdOrNull(request.debateId.toUUID())
            ?: httpBadRequest("존재하지 않는 토론방입니다.")
        val members = debateMemberRepository.findAllByDebateOrderByCreatedAtAsc(debate)
        if (members.isEmpty()) httpBadRequest("토론 참여자가 없습니다.")

        if (debate.startAt.isAfter(Instant.now())) httpBadRequest("아직 시작되지 않은 토론입니다.")

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
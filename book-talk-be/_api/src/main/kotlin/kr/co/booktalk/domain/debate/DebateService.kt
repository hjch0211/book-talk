package kr.co.booktalk.domain.debate

import jakarta.annotation.PreDestroy
import kotlinx.coroutines.CoroutineName
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.launch
import kr.co.booktalk.client.AiClient
import kr.co.booktalk.client.SummarizeRequest
import kr.co.booktalk.config.AppProperties
import kr.co.booktalk.domain.*
import kr.co.booktalk.domain.auth.AuthAccount
import kr.co.booktalk.httpBadRequest
import kr.co.booktalk.toUUID
import org.openapitools.jackson.nullable.JsonNullable
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.Instant

@Service
class DebateService(
    private val accountRepository: AccountRepository,
    private val debateRepository: DebateRepository,
    private val debateMemberRepository: DebateMemberRepository,
    private val debateRoundRepository: DebateRoundRepository,
    private val appProperties: AppProperties,
    private val presentationRepository: PresentationRepository,
    private val debateRoundSpeakerRepository: DebateRoundSpeakerRepository,
    private val debateRoundSpeakerService: DebateRoundSpeakerService,
    private val debateRoundService: DebateRoundService,
    private val bookRepository: BookRepository,
    private val aiClient: AiClient,
    private val debateSummarizationRepository: DebateSummarizationRepository
) {
    private val scope = CoroutineScope(
        SupervisorJob() + Dispatchers.IO + CoroutineName("debate-service")
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
        return CreateResponse(debate.id.toString())
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
        if (debateMemberRepository.countByDebateForUpdate(debate) >= appProperties.debate.maxMemberCount) {
            httpBadRequest("토론방의 최대 정원(${appProperties.debate.maxMemberCount}명)을 초과했습니다.")
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

        val currentRound = debateRoundRepository.findByDebateIdAndEndedAtIsNull(debate.id!!)
        val currentRoundType = currentRound?.type

        /** 토론 라운드 처리 */
        when {
            currentRoundType != null && request.roundType == UpdateRequest.RoundType.PRESENTATION ->
                httpBadRequest("이미 라운드가 시작되었습니다.")

            currentRoundType != DebateRoundType.PRESENTATION && request.roundType == UpdateRequest.RoundType.FREE ->
                httpBadRequest("PRESENTATION 라운드에서만 FREE 라운드로 전환할 수 있습니다.")

            currentRoundType != DebateRoundType.PRESENTATION && request.roundType == UpdateRequest.RoundType.PRESENTATION -> {
                val newRound = debateRoundService.create(
                    CreateRoundRequest(debate.id.toString(), DebateRoundType.PRESENTATION)
                )
                val firstSpeakerId = members[0].account.id.toString()
                debateRoundSpeakerService.create(CreateRoundSpeakerRequest(newRound.id, firstSpeakerId))

                val nextSpeakerId = if (members.size > 1) members[1].account.id.toString() else null
                debateRoundService.patch(PatchRoundRequest(newRound.id, JsonNullable.of(nextSpeakerId)))
            }

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
            request.ended && debate.closedAt != null -> httpBadRequest("이미 종료된 토론입니다.")

            request.ended && currentRoundType != null -> {
                currentRound.nextSpeaker = null
                currentRound.endedAt = Instant.now()
                debate.closedAt = Instant.now()
                debateRoundService.broadcastDebateRoundUpdate(request.debateId, currentRound)
            }
        }
    }


    @Transactional
    fun closeExpiredDebates() {
        val expiredDebates = debateRepository.findAllByCreatedAtBeforeAndClosedAtIsNull(
            Instant.now().minusSeconds(24 * 60 * 60)
        )
        if (expiredDebates.isEmpty()) return

        expiredDebates.forEach { debate ->
            debate.closedAt = Instant.now()
            debateRoundRepository.findByDebateIdAndEndedAtIsNull(debate.id!!)?.let { currentRound ->
                currentRound.endedAt = Instant.now()
            }
        }
    }

    fun summarizeDebate(debateId: String) {
        scope.launch {
            aiClient.summarizeDebate(SummarizeRequest(debateId))
        }
    }
}
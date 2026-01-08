package kr.co.booktalk.domain.debate

import com.fasterxml.jackson.databind.ObjectMapper
import kr.co.booktalk.cache.AppConfigService
import kr.co.booktalk.cache.DebateOnlineAccountsCache
import kr.co.booktalk.cache.WebSocketSessionCache
import kr.co.booktalk.domain.*
import kr.co.booktalk.domain.auth.AuthAccount
import kr.co.booktalk.domain.webSocket.DebateOnlineAccountUpdateResponse
import kr.co.booktalk.domain.webSocket.JoinDebateRequest
import kr.co.booktalk.domain.webSocket.JoinDebateResponse
import kr.co.booktalk.domain.webSocket.sendByMQ
import kr.co.booktalk.httpBadRequest
import kr.co.booktalk.mqInvalidMessage
import kr.co.booktalk.toUUID
import org.openapitools.jackson.nullable.JsonNullable
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.Instant

// TODO: PUB/SUB 도입하여 관심사 분리
@Service
class DebateService(
    private val accountRepository: AccountRepository,
    private val debateRepository: DebateRepository,
    private val debateMemberRepository: DebateMemberRepository,
    private val debateRoundRepository: DebateRoundRepository,
    private val appConfigService: AppConfigService,
    private val presentationRepository: PresentationRepository,
    private val debateRoundSpeakerRepository: DebateRoundSpeakerRepository,
    private val debateRoundSpeakerService: DebateRoundSpeakerService,
    private val debateRoundService: DebateRoundService,
    private val bookRepository: BookRepository,
    private val webSocketSessionCache: WebSocketSessionCache,
    private val debateOnlineAccountsCache: DebateOnlineAccountsCache,
    private val objectMapper: ObjectMapper
) {
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

        return debate.toResponse(members, presentations, currentRound, currentSpeakerId, currentSpeakerAccountId, currentSpeakerEndedAt)
    }

    @Transactional
    fun join(request: JoinRequest, authAccount: AuthAccount) {
        val account = accountRepository.findByIdOrNull(authAccount.id.toUUID()) ?: httpBadRequest("존재하지 않는 사용자입니다.")
        val debate = debateRepository.findByIdOrNull(request.debateId.toUUID())
            ?.validateJoinable()
            ?: httpBadRequest("존재하지 않는 토론입니다.")
        if (debateMemberRepository.countByDebateForUpdate(debate) >= appConfigService.maxDebateMemberCnt()) {
            httpBadRequest("토론방의 최대 정원(${appConfigService.maxDebateMemberCnt()}명)을 초과했습니다.")
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

    /** 토론 라운드 전환 */
    @Transactional
    fun update(request: UpdateRequest) {
        val debate = debateRepository.findByIdOrNull(request.debateId.toUUID())
            ?: httpBadRequest("존재하지 않는 토론방입니다.")
        val members = debateMemberRepository.findAllByDebateOrderByCreatedAtAsc(debate)
        if (members.isEmpty()) httpBadRequest("토론 참여자가 없습니다.")

        val currentRound = debateRoundRepository.findByDebateIdAndEndedAtIsNull(debate.id!!)
        val currentRoundType = currentRound?.type

        // 라운드 전환 검증
        when {
            request.roundType == DebateRoundType.PRESENTATION && currentRoundType != null ->
                httpBadRequest("이미 라운드가 시작되었습니다.")
            request.roundType == DebateRoundType.FREE && currentRoundType != DebateRoundType.PRESENTATION ->
                httpBadRequest("PRESENTATION 라운드에서만 FREE 라운드로 전환할 수 있습니다.")
        }

        val roundResponse = debateRoundService.create(CreateRoundRequest(debate.id.toString(), request.roundType))
        val firstSpeakerId = members[0].account.id!!.toString()
        debateRoundSpeakerService.create(CreateRoundSpeakerRequest(roundResponse.id, firstSpeakerId))

        if (request.roundType == DebateRoundType.PRESENTATION) {
            val nextSpeakerId = if (members.size > 1) members[1].account.id?.toString() else null
            debateRoundService.patch(
                PatchRoundRequest(
                    debateRoundId = roundResponse.id,
                    nextSpeakerId = JsonNullable.of(nextSpeakerId)
                )
            )
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

    fun joinSessionInDebate(payload: JoinDebateRequest.Payload) {
        val session = webSocketSessionCache.get(payload.accountId) ?: mqInvalidMessage("Session not found")
        session.attributes["debateId"] = payload.debateId

        debateOnlineAccountsCache.add(payload.debateId, payload.accountId)
        session.sendByMQ(objectMapper.writeValueAsString(JoinDebateResponse.build(payload.debateId, payload.accountId)))

        val accountIds = debateOnlineAccountsCache.get(payload.debateId)
        accountIds.forEach { accountId ->
            webSocketSessionCache.get(accountId) ?: mqInvalidMessage("Session not found")
            session.sendByMQ(objectMapper.writeValueAsString(DebateOnlineAccountUpdateResponse.build(accountIds)))
        }
    }
}
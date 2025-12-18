package kr.co.booktalk.domain.debate

import kr.co.booktalk.cache.AppConfigService
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
    private val appConfigService: AppConfigService,
    private val presentationRepository: PresentationRepository,
    private val debateRoundSpeakerRepository: DebateRoundSpeakerRepository,
    private val debateRoundSpeakerService: DebateRoundSpeakerService,
    private val debateRoundService: DebateRoundService,
    private val bookRepository: BookRepository
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
        val currentSpeakerId = currentSpeaker?.account?.id?.toString()
        val currentSpeakerEndedAt = currentSpeaker?.endedAt

        return debate.toResponse(members, presentations, currentRound, currentSpeakerId, currentSpeakerEndedAt)
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

    @Transactional
    fun setNextSpeaker(speaker: DebateRoundSpeakerEntity) {
        val round = speaker.debateRound
        val debate = round.debate

        val members = debateMemberRepository.findAllByDebateOrderByCreatedAtAsc(debate)
        if (members.isEmpty()) return

        val currentIndex = members.indexOfFirst { it.account.id == speaker.account.id }
        if (currentIndex == -1) return

        val nextSpeakerId = members[currentIndex + 1].account.id!!.toString()
        val nextWaitingSpeakerId = if (currentIndex < members.size - 2) {
            members[currentIndex + 2].account.id?.toString()
        } else {
            null
        }

        debateRoundSpeakerService.create(CreateRoundSpeakerRequest(round.id, nextSpeakerId))
        debateRoundService.patch(
            PatchRoundRequest(
                debateRoundId = round.id,
                nextSpeakerId = JsonNullable.of(nextWaitingSpeakerId)
            )
        )
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
}
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
    private val debateRoundService: DebateRoundService
) {
    @Transactional
    fun create(request: CreateRequest, authAccount: AuthAccount): CreateResponse {
        val host = accountRepository.findByIdOrNull(authAccount.id.toUUID()) ?: httpBadRequest("존재하지 않는 사용자입니다.")
        val debate = debateRepository.saveAndFlush(request.toEntity(host))
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

    /** Scheduler - 만료된 발표자를 처리하여 다음 발표자로 자동 전환 */
    @Transactional
    fun handleExpiredSpeaker(speaker: DebateRoundSpeakerEntity) {
        val round = speaker.debateRound
        val debate = round.debate

        // PRESENTATION 라운드가 아니거나 이미 종료된 라운드는 무시
        if (round.type != DebateRoundType.PRESENTATION || round.endedAt != null) return

        val members = debateMemberRepository.findAllByDebateOrderByCreatedAtAsc(debate)
        if (members.isEmpty()) return

        val currentIndex = members.indexOfFirst { it.account.id == speaker.account.id }
        if (currentIndex == -1) return

        // 다음 발표자가 있는 경우
        if (currentIndex < members.size - 1) {
            /** 다음 발표자로 전환 */
            val nextSpeakerId = members[currentIndex + 1].account.id!!.toString()
            val nextWaitingSpeakerId = if (currentIndex < members.size - 2) {
                members[currentIndex + 2].account.id?.toString()
            } else {
                null
            }

            // 다음 발표자 생성
            debateRoundSpeakerService.create(CreateRoundSpeakerRequest(round.id, nextSpeakerId))

            // 그 다음 대기 발표자 설정
            debateRoundService.patch(
                PatchRoundRequest(
                    debateRoundId = round.id,
                    nextSpeakerId = JsonNullable.of(nextWaitingSpeakerId)
                )
            )
        } else {
            /** PRESENTATION 라운드 완료 후 FREE 라운드로 전환 */
            val firstSpeakerId = members.firstOrNull()?.account?.id?.toString()

            // FREE 라운드 생성 (기존 PRESENTATION 라운드는 create 메서드 내부에서 자동으로 종료됨)
            val roundResponse = debateRoundService.create(
                CreateRoundRequest(debate.id.toString(), DebateRoundType.FREE)
            )

            // 첫 번째 멤버를 현재 발언자로 지정
            if (firstSpeakerId != null) {
                debateRoundSpeakerService.create(
                    CreateRoundSpeakerRequest(
                        debateRoundId = roundResponse.id,
                        nextSpeakerId = firstSpeakerId
                    )
                )
            }
        }
    }

    /** Scheduler - 생성된 지 24시간이 지난 토론 자동 종료 */
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
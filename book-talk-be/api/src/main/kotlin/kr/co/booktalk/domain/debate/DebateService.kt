package kr.co.booktalk.domain.debate

import kr.co.booktalk.cache.AppConfigService
import kr.co.booktalk.domain.*
import kr.co.booktalk.domain.auth.AuthAccount
import kr.co.booktalk.httpBadRequest
import kr.co.booktalk.toUUID
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
) {
    @Transactional
    fun create(request: CreateRequest, authAccount: AuthAccount) {
        val host = accountRepository.findByIdOrNull(authAccount.id.toUUID()) ?: httpBadRequest("존재하지 않는 사용자입니다.")
        val debate = debateRepository.saveAndFlush(request.toEntity(host))
        debateMemberRepository.save(
            DebateMemberEntity(
                account = host,
                debate = debate,
                role = DebateMemberRole.HOST
            )
        )
    }

    fun findOne(id: String): FindOneResponse {
        val debate = debateRepository.findByIdOrNull(id.toUUID())
            ?: httpBadRequest("존재하지 않는 토론방입니다.")
        val members = debateMemberRepository.findAllByDebateOrderByCreatedAtAsc(debate)
        val presentations = presentationRepository.findAllByDebateOrderByCreatedAtAsc(debate)
        val currentRound = debateRoundRepository.findByDebateAndEndedAtIsNull(debate)
        val currentSpeakerId = currentRound
            ?.let { debateRoundSpeakerRepository.findByDebateRoundAndEndedAtIsAfter(it, Instant.now()) }
            ?.account?.id.toString()

        return debate.toResponse(members, presentations, currentRound, currentSpeakerId)
    }

    fun join(request: JoinRequest, authAccount: AuthAccount) {
        val account = accountRepository.findByIdOrNull(authAccount.id.toUUID()) ?: httpBadRequest("존재하지 않는 사용자입니다.")
        val debate = debateRepository.findByIdOrNull(request.debateId.toUUID())
            ?.validateJoinable(appConfigService.joinDebateDeadlineSeconds())
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
    }
}
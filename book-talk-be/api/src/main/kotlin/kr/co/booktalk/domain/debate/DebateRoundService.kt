package kr.co.booktalk.domain.debate

import kr.co.booktalk.domain.*
import kr.co.booktalk.domain.auth.AuthAccount
import kr.co.booktalk.httpBadRequest
import kr.co.booktalk.httpForbidden
import kr.co.booktalk.toUUID
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.Instant

@Service
class DebateRoundService(
    private val debateRepository: DebateRepository,
    private val debateMemberRepository: DebateMemberRepository,
    private val accountRepository: AccountRepository,
    private val debateRoundRepository: DebateRoundRepository,
) {
    fun create(request: CreateRoundRequest, authAccount: AuthAccount) {
        if (!isHost(request.debateId, authAccount.id)) httpForbidden("토론 방장이 아닙니다.")
        val debate = debateRepository.findByIdOrNull(request.debateId.toUUID())
            ?: httpBadRequest("존재하지 않는 토론입니다.")
        val nextSpeaker = accountRepository.findByIdOrNull(request.nextSpeakerId.toUUID())
            ?: httpBadRequest("존재하지 않는 계정입니다.")
        if (!debateMemberRepository.existsByDebateAndAccount(debate, nextSpeaker)) httpBadRequest("발언자가 토론 멤버가 아닙니다.")

        debateRoundRepository.save(request.toEntity(debate, nextSpeaker))
    }

    @Transactional
    fun patch(request: PatchRoundRequest, authAccount: AuthAccount) {
        val debateRound = debateRoundRepository.findByIdOrNull(request.debateRoundId)
            ?: httpBadRequest("존재하지 않는 톡서 토론 라운드입니다.")
        if (!isHost(debateRound.debate.id.toString(), authAccount.id)) httpForbidden("토론 방장이 아닙니다.")
        request.nextSpeakerId?.let {
            debateRound.nextSpeaker = accountRepository.findByIdOrNull(it.toUUID()) ?: httpBadRequest("존재하지 않는 계정입니다.")
        }
        request.ended?.takeIf { it }?.let { debateRound.endedAt = Instant.now() }
    }

    /** 토론 방장 검증 */
    private fun isHost(debateId: String, accountId: String): Boolean {
        return debateMemberRepository.existsByDebateIdAndAccountIdAndRole(
            debateId.toUUID(),
            accountId.toUUID(),
            DebateMemberRole.HOST
        )
    }


}
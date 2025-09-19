package kr.co.booktalk.domain.debate

import kr.co.booktalk.cache.AppConfigService
import kr.co.booktalk.domain.*
import kr.co.booktalk.httpBadRequest
import kr.co.booktalk.toUUID
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.Instant

@Service
class DebateRoundSpeakerService(
    private val accountRepository: AccountRepository,
    private val debateRoundSpeakerRepository: DebateRoundSpeakerRepository,
    private val debateRoundRepository: DebateRoundRepository,
    private val appConfigService: AppConfigService,
    private val debateMemberRepository: DebateMemberRepository
) {
    fun create(request: CreateRoundSpeakerRequest) {
        val debateRound = debateRoundRepository.findByIdOrNull(request.debateRoundId)
            ?: httpBadRequest("존재하지 않는 토론 라운드입니다.")
        val speaker = accountRepository.findByIdOrNull(request.nextSpeakerId.toUUID())
            ?: httpBadRequest("존재하지 않는 계정입니다.")
        if (!debateMemberRepository.existsByDebateAndAccount(debateRound.debate, speaker))
            httpBadRequest("발언자가 토론 멤버가 아닙니다.")

        debateRoundSpeakerRepository.save(
            DebateRoundSpeakerEntity(
                account = speaker,
                debateRound = debateRound,
                endedAt = Instant.now().plusSeconds(appConfigService.debateRoundSpeakerSeconds())
            )
        )
    }

    @Transactional
    fun patch(request: PatchRoundSpeakerRequest) {
        val speaker = debateRoundSpeakerRepository.findByIdOrNull(request.debateRoundSpeakerId)
            ?: httpBadRequest("존재하지 않는 토론 발언자입니다.")

        request.extension?.takeIf { it }?.let {
            speaker.endedAt = speaker.endedAt.plusSeconds(appConfigService.debateRoundSpeakerSeconds())
        }
        request.ended?.takeIf { it }?.let {
            speaker.endedAt = Instant.now()
        }
    }
}
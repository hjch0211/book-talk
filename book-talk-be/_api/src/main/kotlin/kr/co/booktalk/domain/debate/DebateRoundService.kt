package kr.co.booktalk.domain.debate

import kr.co.booktalk.domain.AccountRepository
import kr.co.booktalk.domain.DebateRepository
import kr.co.booktalk.domain.DebateRoundRepository
import kr.co.booktalk.httpBadRequest
import kr.co.booktalk.toUUID
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.Instant

@Service
class DebateRoundService(
    private val debateRepository: DebateRepository,
    private val accountRepository: AccountRepository,
    private val debateRoundRepository: DebateRoundRepository,
    private val debateRealtimeService: DebateRealtimeService,
) {
    @Transactional
    fun create(request: CreateRoundRequest): CreateRoundResponse {
        val debate = debateRepository.findByIdOrNull(request.debateId.toUUID())
            ?: httpBadRequest("존재하지 않는 토론입니다.")

        // 이전 라운드가 있다면 종료 처리
        debateRoundRepository.findByDebateIdAndEndedAtIsNull(debate.id!!)?.let { existingRound ->
            existingRound.endedAt = Instant.now()
        }

        val debateRound = debateRoundRepository.saveAndFlush(request.toEntity(debate))

        debateRealtimeService.broadcastDebateRoundUpdate(request.debateId, debateRound)

        return CreateRoundResponse(debateRound.id)
    }

    @Transactional
    fun patch(request: PatchRoundRequest) {
        val debateRound = debateRoundRepository.findByIdOrNull(request.debateRoundId)
            ?: httpBadRequest("존재하지 않는 톡서 토론 라운드입니다.")

        if (request.nextSpeakerId?.isPresent == true) {
            debateRound.nextSpeaker = request.nextSpeakerId.get()?.let { accountId ->
                accountRepository.findByIdOrNull(accountId.toUUID())
                    ?: httpBadRequest("존재하지 않는 계정입니다.")
            }
        }

        if (request.ended?.isPresent == true && request.ended.get() == true) {
            debateRound.endedAt = Instant.now()
        }
    }
}
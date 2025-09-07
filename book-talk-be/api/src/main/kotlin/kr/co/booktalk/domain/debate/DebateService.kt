package kr.co.booktalk.domain.debate

import kr.co.booktalk.cache.AppConfigService
import kr.co.booktalk.domain.AccountRepository
import kr.co.booktalk.domain.DebateRepository
import kr.co.booktalk.domain.auth.AuthAccount
import kr.co.booktalk.httpBadRequest
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service

@Service
class DebateService(
    private val accountRepository: AccountRepository,
    private val debateRepository: DebateRepository,
    private val appConfigService: AppConfigService
) {
    fun create(request: CreateRequest, authAccount: AuthAccount) {
        val host = accountRepository.findByIdOrNull(authAccount.id) ?: httpBadRequest("존재하지 않는 사용자입니다.")
        debateRepository.save(request.toEntity(host))
    }

    fun findOne(id: String): FindOneResponse {
        return debateRepository.findByIdOrNull(id)?.toResponse()
            ?: httpBadRequest("존재하지 않는 토론방입니다.")
    }

    fun join(request: JoinRequest, authAccount: AuthAccount) {
        debateRepository.findByIdOrNull(request.debateId)
            ?.validateJoinable(appConfigService.joinDebateDeadlineSeconds())
            ?: httpBadRequest("존재하지 않는 토론입니다.")
    }
}
package kr.co.booktalk.domain.account

import kr.co.booktalk.domain.AccountRepository
import kr.co.booktalk.domain.auth.AuthAccount
import kr.co.booktalk.httpBadRequest
import kr.co.booktalk.toUUID
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class AccountService(
    private val accountRepository: AccountRepository,
) {
    fun findMy(authAccount: AuthAccount): FindMyResponse {
        return accountRepository.findByIdOrNull(authAccount.id.toUUID())?.toResponse()
            ?: httpBadRequest("존재하지 않는 계정입니다.")
    }

    @Transactional
    fun patchMy(authAccount: AuthAccount, request: PatchMyRequest) {
        val me = accountRepository.findByIdOrNull(authAccount.id.toUUID()) ?: httpBadRequest("존재하지 않는 계정입니다.")
        if (accountRepository.existsByName(request.name)) httpBadRequest("이미 사용 중인 이름입니다.")
        me.name = request.name
    }
}

package kr.co.booktalk.domain.account

import kr.co.booktalk.domain.AccountEntity
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
    fun create(request: CreateRequest): AccountEntity {
        if (accountRepository.existsByName(request.name)) {
            httpBadRequest("이미 존재하는 계정입니다.")
        }

        return accountRepository.save(
            AccountEntity(
                name = request.name
            )
        )
    }

    fun find(name: String): AccountEntity {
        return accountRepository.findByName(name) ?: httpBadRequest("존재하지 않는 계정입니다.")
    }

    fun find(authAccount: AuthAccount): FindMyResponse {
        return accountRepository.findByIdOrNull(authAccount.id.toUUID())?.toResponse()
            ?: httpBadRequest("존재하지 않는 계정입니다.")
    }

    @Transactional
    fun patchMy(authAccount: AuthAccount, request: PatchMyRequest) {
        val me = accountRepository.findByIdOrNull(authAccount.id.toUUID()) ?: httpBadRequest("존재하지 않는 계정입니다.")
        if (accountRepository.existsByName(request.name)) httpBadRequest("이미 존재하는 이름입니다.")
        me.name = request.name
    }

    @Transactional
    fun update(authAccount: AuthAccount, request: UpdateRequest) {
        val account = accountRepository.findByIdOrNull(authAccount.id.toUUID())
            ?: httpBadRequest("존재하지 않는 계정입니다.")
        account.refreshToken = request.refreshToken
    }

    @Transactional
    fun update(oldRefreshToken: String, newRefreshToken: String) {
        val account = accountRepository.findByRefreshToken(oldRefreshToken) ?: httpBadRequest("존재하지 않는 계정입니다.")
        account.refreshToken = newRefreshToken
    }
}

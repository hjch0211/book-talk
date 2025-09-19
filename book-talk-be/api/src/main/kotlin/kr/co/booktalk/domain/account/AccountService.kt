package kr.co.booktalk.domain.account

import kr.co.booktalk.domain.AccountEntity
import kr.co.booktalk.domain.AccountRepository
import kr.co.booktalk.domain.auth.AuthAccount
import kr.co.booktalk.httpBadRequest
import kr.co.booktalk.toUUID
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service

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

    fun findByName(name: String): AccountEntity {
        return accountRepository.findByName(name) ?: httpBadRequest("존재하지 않는 계정입니다.")
    }

    fun findMy(authAccount: AuthAccount): FindMyResponse {
        return accountRepository.findByIdOrNull(authAccount.id.toUUID())?.toResponse()
            ?: httpBadRequest("존재하지 않는 계정입니다.")
    }
}

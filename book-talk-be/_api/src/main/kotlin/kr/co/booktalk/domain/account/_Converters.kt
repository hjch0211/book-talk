package kr.co.booktalk.domain.account

import kr.co.booktalk.domain.AccountEntity
import kr.co.booktalk.domain.auth.AuthAccount

fun AccountEntity.toResponse(): FindMyResponse {
    return FindMyResponse(
        id = id.toString(),
        name = name,
        createdAt = createdAt
    )
}

fun AccountEntity.toAuthAccount(): AuthAccount {
    return AuthAccount(id.toString())
}
package kr.co.booktalk.domain.account

import kr.co.booktalk.domain.AccountEntity

fun AccountEntity.toResponse(): FindMyResponse {
    return FindMyResponse(
        id = id!!,
        name = name,
        createdAt = createdAt
    )
}
package kr.co.booktalk.domain.presentation

import kr.co.booktalk.domain.PresentationEntity

fun PresentationEntity.toResponse(): FindOneResponse {
    return FindOneResponse(
        id = id!!,
        accountId = account.id!!,
        debateId = debate.id!!,
        content = content
    )
}
package kr.co.booktalk.domain.presentation

import kr.co.booktalk.domain.PresentationEntity

fun PresentationEntity.toResponse(): FindOneResponse {
    return FindOneResponse(
        id = id.toString(),
        accountId = account.id.toString(),
        debateId = debate.id.toString(),
        content = content,
        lastUpdatedAt = updatedAt
    )
}
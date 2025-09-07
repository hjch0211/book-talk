package kr.co.booktalk.domain.debate

import kr.co.booktalk.domain.AccountEntity
import kr.co.booktalk.domain.DebateEntity

fun CreateRequest.toEntity(host: AccountEntity): DebateEntity {
    return DebateEntity(
        host = host,
        bookImageUrl = bookImageUrl,
        topic = topic,
        description = description,
        headCount = headCount,
        startedAt = startedAt
    )
}

fun DebateEntity.toResponse(): FindOneResponse {
    return FindOneResponse(
        id = id.toString(),
        bookImageUrl = bookImageUrl,
        topic = topic,
        description = description,
        headCount = headCount,
        startedAt = startedAt,
        closedAt = closedAt,
        createdAt = createdAt,
        updatedAt = updatedAt,
        archivedAt = archivedAt
    )
}
package kr.co.booktalk.domain.debate

import kr.co.booktalk.domain.AccountEntity
import kr.co.booktalk.domain.DebateEntity
import kr.co.booktalk.domain.DebateMemberEntity
import kr.co.booktalk.domain.PresentationEntity

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

fun DebateEntity.toResponse(
    members: List<DebateMemberEntity>,
    presentations: List<PresentationEntity>
): FindOneResponse {
    return FindOneResponse(
        id = id.toString(),
        members = members.map { FindOneResponse.MemberInfo(it.account.id!!, it.role) },
        presentations = presentations.map { FindOneResponse.PresentationInfo(it.id!!, it.account.id!!) },
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
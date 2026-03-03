package kr.co.booktalk.domain.debate

import kr.co.booktalk.domain.*
import java.time.Instant

fun CreateRequest.toEntity(host: AccountEntity, book: BookEntity): DebateEntity {
    return DebateEntity(
        host = host,
        book = book,
        topic = topic,
        description = description,
        maxMemberCount = maxMemberCount,
        startAt = startAt,
    )
}

fun DebateEntity.toResponse(
    members: List<DebateMemberEntity>,
    presentations: List<PresentationEntity>,
    currentRound: DebateRoundEntity? = null,
    currentSpeakerId: Long? = null,
    currentSpeakerAccountId: String? = null,
    currentSpeakerEndedAt: Instant? = null,
    aiSummarized: String? = null
): FindOneResponse {
    return FindOneResponse(
        id = id.toString(),
        members = members.map { FindOneResponse.MemberInfo(it.account.id.toString(), it.account.name, it.role) },
        presentations = presentations.map {
            FindOneResponse.PresentationInfo(
                it.id.toString(),
                it.account.id.toString()
            )
        },
        currentRound = currentRound?.toRoundInfo(currentSpeakerId, currentSpeakerAccountId, currentSpeakerEndedAt),
        bookInfo = FindOneResponse.BookInfo(
            title = book.title,
            author = book.author,
            description = book.description ?: "",
            imageUrl = book.imageUrl ?: "",
            detailUrl = book.detailUrl,
        ),
        topic = topic,
        maxMemberCount = maxMemberCount.toLong(),
        description = description,
        aiSummarized = aiSummarized,
        startAt = startAt,
        closedAt = closedAt,
        createdAt = createdAt,
        updatedAt = updatedAt,
        archivedAt = archivedAt
    )
}

fun DebateRoundEntity.toRoundInfo(
    currentSpeakerId: Long? = null,
    currentSpeakerAccountId: String? = null,
    currentSpeakerEndedAt: java.time.Instant? = null
): FindOneResponse.RoundInfo {
    return FindOneResponse.RoundInfo(
        id = id,
        type = type,
        currentSpeakerId = currentSpeakerId,
        currentSpeakerAccountId = currentSpeakerAccountId,
        nextSpeakerAccountId = nextSpeaker?.id.toString(),
        currentSpeakerEndedAt = currentSpeakerEndedAt,
        createdAt = createdAt,
        endedAt = endedAt,
    )
}

fun DebateEntity.toDebateInfo(members: List<DebateMemberEntity>): FindAllResponse.DebateInfo {
    return FindAllResponse.DebateInfo(
        id = id.toString(),
        bookInfo = FindAllResponse.DebateInfo.BookInfo(
            title = book.title,
            author = book.author,
            imageUrl = book.imageUrl,
            detailUrl = book.detailUrl,
        ),
        topic = topic,
        description = description,
        maxMemberCount = maxMemberCount.toLong(),
        members = members.map { FindAllResponse.DebateInfo.MemberInfo(it.account.id.toString(), it.account.name, it.role) },
        startAt = startAt,
        closedAt = closedAt,
        createdAt = createdAt,
    )
}

fun CreateRoundRequest.toEntity(debate: DebateEntity): DebateRoundEntity {
    return DebateRoundEntity(
        type = type,
        debate = debate,
        nextSpeaker = null
    )
}
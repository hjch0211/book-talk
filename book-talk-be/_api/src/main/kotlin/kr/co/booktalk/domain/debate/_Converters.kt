package kr.co.booktalk.domain.debate

import kr.co.booktalk.domain.*

fun CreateRequest.toEntity(host: AccountEntity, book: BookEntity): DebateEntity {
    return DebateEntity(
        host = host,
        book = book,
        topic = topic,
        description = description,
    )
}

fun DebateEntity.toResponse(
    members: List<DebateMemberEntity>,
    presentations: List<PresentationEntity>,
    currentRound: DebateRoundEntity? = null,
    currentSpeakerId: String? = null,
    currentSpeakerEndedAt: java.time.Instant? = null
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
        currentRound = currentRound?.toRoundInfo(currentSpeakerId, currentSpeakerEndedAt),
        bookInfo = FindOneResponse.BookInfo(
            title = book.title,
            author = book.author,
            description = book.description ?: "",
            imageUrl = book.imageUrl ?: "",
        ),
        topic = topic,
        description = description,
        closedAt = closedAt,
        createdAt = createdAt,
        updatedAt = updatedAt,
        archivedAt = archivedAt
    )
}

fun DebateRoundEntity.toRoundInfo(
    currentSpeakerId: String? = null,
    currentSpeakerEndedAt: java.time.Instant? = null
): FindOneResponse.RoundInfo {
    return FindOneResponse.RoundInfo(
        id = id,
        type = type,
        currentSpeakerId = currentSpeakerId,
        nextSpeakerId = nextSpeaker?.id.toString(),
        currentSpeakerEndedAt = currentSpeakerEndedAt,
        createdAt = createdAt,
        endedAt = endedAt,
    )
}

fun CreateRoundRequest.toEntity(debate: DebateEntity): DebateRoundEntity {
    return DebateRoundEntity(
        type = type,
        debate = debate,
        nextSpeaker = null
    )
}
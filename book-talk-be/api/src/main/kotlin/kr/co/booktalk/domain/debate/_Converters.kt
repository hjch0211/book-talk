package kr.co.booktalk.domain.debate

import kr.co.booktalk.domain.*

fun CreateRequest.toEntity(host: AccountEntity): DebateEntity {
    return DebateEntity(
        host = host,
        bookImageUrl = bookImageUrl,
        topic = topic,
        description = description,
    )
}

fun DebateEntity.toResponse(
    members: List<DebateMemberEntity>,
    presentations: List<PresentationEntity>,
    currentRound: DebateRoundEntity? = null,
    currentSpeakerId: String? = null
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
        currentRound = if (currentRound != null && currentSpeakerId != null) currentRound.toRoundInfo(currentSpeakerId) else null,
        bookImageUrl = bookImageUrl,
        topic = topic,
        description = description,
        closedAt = closedAt,
        createdAt = createdAt,
        updatedAt = updatedAt,
        archivedAt = archivedAt
    )
}

fun DebateRoundEntity.toRoundInfo(currentSpeakerId: String): FindOneResponse.RoundInfo {
    return FindOneResponse.RoundInfo(
        id = id,
        type = type,
        currentSpeakerId = currentSpeakerId,
        nextSpeakerId = nextSpeaker?.id.toString(),
        createdAt = createdAt,
        endedAt = endedAt,
    )
}

fun CreateRoundRequest.toEntity(debate: DebateEntity, speaker: AccountEntity): DebateRoundEntity {
    return DebateRoundEntity(
        type = type,
        debate = debate,
        nextSpeaker = speaker
    )
}
package kr.co.booktalk.domain.debate

import kr.co.booktalk.domain.DebateEntity
import java.time.Instant

fun CreateRequest.validate() {
    Instant.now()
    require(bookImageUrl.isNotBlank()) { "bookImageUrl은 필수입니다." }
    require(topic.isNotBlank()) { "topic은 필수입니다." }
}

fun JoinRequest.validate() {
    require(debateId.isNotBlank()) { "debateId는 필수입니다." }
}

fun DebateEntity.validateJoinable(): DebateEntity {
    this.validateActive()

    return this
}

fun DebateEntity.validateActive(): DebateEntity {
    require(closedAt == null) { "종료된 토론입니다." }

    return this
}

fun CreateRoundRequest.validate() {
    require(debateId.isNotBlank()) { "debateId는 필수입니다." }
}

fun PatchRoundRequest.validate() {
    require(debateRoundId > 0) { "debateRoundId는 필수입니다." }
}

fun CloseRoundRequest.validate() {
    require(debateId.isNotBlank()) { "debateId는 필수입니다." }
}

fun CreateRoundSpeakerRequest.validate() {
    require(debateRoundId > 0) { "debateRoundId는 필수입니다." }
    require(nextSpeakerId.isNotBlank()) { "nextSpeakerId는 필수입니다." }
}

fun PatchRoundSpeakerRequest.validate() {
    require(debateRoundSpeakerId > 0) { "debateRoundSpeakerId는 필수입니다." }
}

fun CreateChatRequest.validate() {
    require(debateId.isNotBlank()) { "토론 ID는 필수입니다." }
    require(content.isNotBlank()) { "채팅 내용은 필수입니다." }
    require(content.length <= 100000) { "채팅 내용은 100000자를 초과할 수 없습니다." }
}
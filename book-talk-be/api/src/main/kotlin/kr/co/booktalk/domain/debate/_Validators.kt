package kr.co.booktalk.domain.debate

import kr.co.booktalk.domain.DebateEntity
import java.time.Instant

fun CreateRequest.validate(joinDebateDeadlineSeconds: Long, maxDebateMemberCnt: Long) {
    val now = Instant.now()
    require(bookImageUrl.isNotBlank()) { "bookImageUrl은 필수입니다." }
    require(topic.isNotBlank()) { "topic은 필수입니다." }
    require(headCount in 2..maxDebateMemberCnt) { "headCount는 2명 이상 ${maxDebateMemberCnt}명 이하여야 합니다." }
    require(startedAt.isAfter(now.plusSeconds(joinDebateDeadlineSeconds))) { "토론 생성 가능 시간이 아닙니다." }
}

fun JoinRequest.validate() {
    require(debateId.isNotBlank()) { "debateId는 필수입니다." }
}

fun DebateEntity.validateJoinable(joinDebateDeadlineSeconds: Long): DebateEntity {
    val now = Instant.now()
    require(now.isBefore(startedAt.minusSeconds(joinDebateDeadlineSeconds))) { "토론 참여 가능 시간이 아닙니다." }
    this.validateActive()

    return this
}

fun DebateEntity.validateActive(): DebateEntity {
    require(closedAt == null) { "종료된 토론입니다." }

    return this
}

fun CreateRoundRequest.validate() {
    require(debateId.isNotBlank()) { "debateId는 필수입니다." }
    require(nextSpeakerId.isNotBlank()) { "nextSpeakerId는 필수입니다." }
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
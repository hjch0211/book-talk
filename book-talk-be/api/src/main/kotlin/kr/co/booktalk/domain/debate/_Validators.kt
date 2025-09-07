package kr.co.booktalk.domain.debate

import kr.co.booktalk.domain.DebateEntity
import java.time.Instant

fun CreateRequest.validate(joinDebateDeadlineSeconds: Long) {
    val now = Instant.now()
    require(bookImageUrl.isNotBlank()) { "bookImageUrl은 필수입니다." }
    require(topic.isNotBlank()) { "topic은 필수입니다." }
    require(headCount in 2..4) { "headCount는 2명 이상 4명 이하이어야 합니다." }
    require(startedAt.isAfter(now.plusSeconds(joinDebateDeadlineSeconds))) { "토론 생성 가능 시간이 아닙니다." }
}

fun JoinRequest.validate() {
    require(debateId.isNotBlank()) { "debateId는 필수입니다." }
}

fun DebateEntity.validateJoinable(joinDebateDeadlineSeconds: Long) {
    val now = Instant.now()
    require(now.isBefore(startedAt.minusSeconds(joinDebateDeadlineSeconds))) { "토론 참여 가능 시간이 아닙니다." }
    require(closedAt == null) { "종료된 토론입니다." }
}
package kr.co.booktalk.domain.presentation

import kr.co.booktalk.domain.PresentationEntity
import kr.co.booktalk.domain.auth.AuthAccount

fun PresentationEntity.validateUpdatable(authAccount: AuthAccount): PresentationEntity {
    require(account.id.toString() == authAccount.id) { "자신의 프로젠테이션만 수정 가능합니다." }

    return this
}
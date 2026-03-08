package kr.co.booktalk.domain.account

import kr.co.booktalk.isLengthInRange

fun PatchMyRequest.validate() {
    require(name.isNotBlank() && name.isLengthInRange(1, 10)) { "유효하지 않은 이름입니다." }
}

fun PatchMyPasswordRequest.validate() {
    require(currentPassword.isNotBlank()) { "현재 비밀번호를 입력해주세요." }
    require(newPassword.isLengthInRange(8, 100)) { "새 비밀번호는 8자 이상이어야 합니다." }
}
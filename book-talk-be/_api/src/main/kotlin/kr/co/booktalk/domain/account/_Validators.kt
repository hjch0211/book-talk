package kr.co.booktalk.domain.account

import kr.co.booktalk.isLengthInRange

fun PatchMyRequest.validate() {
    require(name.isNotBlank() && name.isLengthInRange(1, 10)) { "유효하지 않은 이름입니다." }
}
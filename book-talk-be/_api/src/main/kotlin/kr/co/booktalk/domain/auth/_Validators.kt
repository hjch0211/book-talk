package kr.co.booktalk.domain.auth

import kr.co.booktalk.isLengthInRange

fun SignUpRequest.validate() {
    require(name.isNotBlank() && name.isLengthInRange(1, 50)) { "유효하지 않은 이름입니다." }
}

fun ValidateDuplicateSignInRequest.validate() {
    require(name.isNotBlank() && name.isLengthInRange(1, 50)) { "유효하지 않은 이름입니다." }
}

fun SignInRequest.validate() {
    require(name.isNotBlank()) { "유효하지 않은 이름입니다." }
}

fun RefreshRequest.validate() {
    require(refreshToken.isNotBlank()) { "유효하지 않은 리프레시 토큰입니다." }
}
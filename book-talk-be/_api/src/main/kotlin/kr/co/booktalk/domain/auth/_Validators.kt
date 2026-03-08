package kr.co.booktalk.domain.auth

import kr.co.booktalk.isEmail
import kr.co.booktalk.isLengthInRange
import kr.co.booktalk.isPassword

fun SignUpRequest.validate() {
    require(email.isEmail()) { "유효하지 않은 이메일입니다." }
    require(name.isNotBlank() && name.isLengthInRange(1, 10)) { "유효하지 않은 이름입니다." }
    require(password.isPassword()) { "유효하지 않은 비밀번호입니다." }
}

fun SignInRequest.validate() {
    require(email.isNotBlank()) { "유효하지 않은 이메일입니다." }
    require(password.isNotBlank()) { "유효하지 않은 비밀번호입니다." }
}

fun SendSignUpOtpRequest.validate() {
    require(email.isEmail()) { "유효하지 않은 이메일입니다." }
}

fun VerifySignUpOtpRequest.validate() {
    require(email.isEmail()) { "유효하지 않은 이메일입니다." }
    require(code.isNotBlank()) { "유효하지 않은 인증 코드입니다." }
}

fun SendPasswordResetOtpRequest.validate() {
    require(email.isEmail()) { "유효하지 않은 이메일입니다." }
}

fun VerifyPasswordResetOtpRequest.validate() {
    require(email.isEmail()) { "유효하지 않은 이메일입니다." }
    require(code.isNotBlank()) { "유효하지 않은 인증 코드입니다." }
}

fun ResetPasswordRequest.validate() {
    require(email.isEmail()) { "유효하지 않은 이메일입니다." }
    require(newPassword.isPassword()) { "유효하지 않은 비밀번호입니다." }
}

fun RefreshRequest.validate() {
    require(refreshToken.isNotBlank()) { "유효하지 않은 리프레시 토큰입니다." }
}

fun VerifyPasswordRequest.validate() {
    require(password.isNotBlank()) { "비밀번호를 입력해 주세요." }
}

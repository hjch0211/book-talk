package kr.co.booktalk

fun String.isEmail(): Boolean {
    return this.matches(Regex("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\$"))
}

fun String.isLengthInRange(min: Int, max: Int): Boolean {
    return this.length in min..max
}

/** 8자 이상, 영문, 숫자, 특수 문자 포함 여부 검사 */
fun String.isPassword(): Boolean {
    return this.length >= 8 &&
            this.any { it.isLetter() } &&
            this.any { it.isDigit() } &&
            this.any { "!@#\$%^&*()-_=+[]{}|;:',.<>?/~`".contains(it) }
}
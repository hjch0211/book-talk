package kr.co.booktalk

import java.security.SecureRandom

private val CHARS = ('A'..'Z') + ('0'..'9')
private val SECURE_RANDOM = SecureRandom()

fun generateCode(length: Int = 6): String {
    return (1..length)
        .map { CHARS[SECURE_RANDOM.nextInt(CHARS.size)] }
        .joinToString("")
}
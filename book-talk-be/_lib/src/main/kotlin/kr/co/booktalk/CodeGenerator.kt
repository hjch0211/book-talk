package kr.co.booktalk

import java.security.SecureRandom

private val CHARS = ('A'..'Z') + ('0'..'9')

fun generateCode(length: Int = 6): String {
    return (1..length)
        .map { CHARS[SecureRandom().nextInt(CHARS.size)] }
        .joinToString("")
}
package kr.co.booktalk

import at.favre.lib.crypto.bcrypt.BCrypt
import java.security.MessageDigest

/** 빠른 연산용 */
fun String.sha256(): String {
    val hashBytes = MessageDigest.getInstance("SHA-256").digest(this.toByteArray(Charsets.UTF_8))
    return hashBytes.joinToString("") { "%02x".format(it) }
}

fun String.matchesSha256(hashed: String): Boolean {
    return this.sha256() == hashed
}

/** Brute force 및 Rainbow table 공격 보안용 */
fun String.bcrypt(): String {
    return BCrypt.withDefaults().hashToString(12, this.toCharArray())
}

fun String.matchesBcrypt(hashed: String): Boolean {
    return BCrypt.verifyer().verify(this.toCharArray(), hashed).verified
}
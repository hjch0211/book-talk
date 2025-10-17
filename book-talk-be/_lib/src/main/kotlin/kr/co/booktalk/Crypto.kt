import io.github.oshai.kotlinlogging.KotlinLogging
import java.nio.charset.StandardCharsets
import java.util.*
import javax.crypto.Cipher
import javax.crypto.SecretKey

/** 문자열 암호화/복호화 */
interface CryptoService {
    fun encrypt(plain: String): String
    fun decrypt(secret: String): String
}

class AESCryptoService(private val key: SecretKey) : CryptoService {
    override fun encrypt(plain: String): String {
        val aes = Cipher.getInstance("AES").apply { init(Cipher.ENCRYPT_MODE, key) }
        val encrypted = aes.doFinal(plain.toByteArray(StandardCharsets.UTF_8))
        return Base64.getEncoder().encodeToString(encrypted)
    }

    override fun decrypt(secret: String): String {
        val aes = Cipher.getInstance("AES").apply { init(Cipher.DECRYPT_MODE, key) }
        val decodedBytes = aes.doFinal(Base64.getDecoder().decode(secret))
        return String(decodedBytes, StandardCharsets.UTF_8)
    }
}

class NoOpCryptoService : CryptoService {
    private val logger = KotlinLogging.logger {}

    override fun encrypt(plain: String): String {
        logger.info { "[NoOp] plain was encrypted" }
        return plain
    }

    override fun decrypt(secret: String): String {
        logger.info { "[NoOp] secret was decrypted" }
        return secret
    }
}
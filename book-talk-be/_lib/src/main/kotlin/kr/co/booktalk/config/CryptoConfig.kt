package kr.co.booktalk.config

import AESCryptoService
import CryptoService
import NoOpCryptoService
import io.github.oshai.kotlinlogging.KotlinLogging
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import javax.crypto.spec.SecretKeySpec

@Configuration
class CryptoConfig {
    private val logger = KotlinLogging.logger {}

    @Bean
    fun cryptoService(properties: LibProperties): CryptoService {
        return if (properties.aes.isValid()) {
            AESCryptoService(SecretKeySpec(properties.aes.secretString.toByteArray(), "AES"))
        } else {
            logger.warn { "[NoOp] CryptoService 환경 변수가 유효하지 않습니다. NoOpCryptoService를 사용합니다." }
            NoOpCryptoService()
        }
    }
}
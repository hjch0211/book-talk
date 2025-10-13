package kr.co.booktalk

import CryptoService
import jakarta.persistence.AttributeConverter
import jakarta.persistence.Converter
import org.springframework.data.annotation.Immutable

interface SecretString {
    val plain: String
    val secret: String
}

private data class SecretStringImpl(
    override val plain: String,
    override val secret: String,
) : SecretString

fun CryptoService.createSecretString(plain: String): SecretString {
    return SecretStringImpl(plain, this.encrypt(plain))
}

@Converter
@Immutable
class SecretStringConverter(
    private val cryptoService: CryptoService
) : AttributeConverter<SecretString, String> {
    override fun convertToDatabaseColumn(entityAttribute: SecretString?): String? {
        return entityAttribute?.let { cryptoService.encrypt(it.plain) }
    }

    override fun convertToEntityAttribute(dbData: String?): SecretString? {
        return if (dbData.isNullOrBlank()) null else SecretStringImpl(cryptoService.decrypt(dbData), dbData)
    }
}

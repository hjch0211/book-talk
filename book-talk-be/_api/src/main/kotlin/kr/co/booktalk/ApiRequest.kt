package kr.co.booktalk

import com.fasterxml.jackson.core.JsonParser
import com.fasterxml.jackson.databind.DeserializationContext
import com.fasterxml.jackson.databind.JsonDeserializer
import com.fasterxml.jackson.databind.annotation.JsonDeserialize

/** Null과 Absent를 구별 */
@JsonDeserialize(using = NullableDeserializer::class)
data class Nullable<T>(val isPresent: Boolean, val value: T?) {
    companion object {
        fun <T> of(value: T?): Nullable<T> = Nullable(true, value)
        fun <T> absent(): Nullable<T> = Nullable(false, null)
    }
}

class NullableDeserializer : JsonDeserializer<Nullable<*>>() {
    override fun deserialize(p: JsonParser, ctxt: DeserializationContext): Nullable<*> {
        val node = p.readValueAsTree<com.fasterxml.jackson.databind.JsonNode>()

        // null 값이면 Nullable.of(null)
        if (node.isNull) {
            return Nullable.of(null)
        }

        // 객체 형태 { "isPresent": true/false, "value": ... }
        if (node.isObject) {
            val isPresent = node.get("isPresent")?.asBoolean() ?: true
            val valueNode = node.get("value")

            if (!isPresent) {
                return Nullable.absent<Any>()
            }

            val value = when {
                valueNode == null || valueNode.isNull -> null
                valueNode.isTextual -> valueNode.asText()
                valueNode.isBoolean -> valueNode.asBoolean()
                valueNode.isInt -> valueNode.asInt()
                valueNode.isLong -> valueNode.asLong()
                valueNode.isDouble -> valueNode.asDouble()
                else -> valueNode.toString()
            }
            return Nullable.of(value)
        }

        // 단순 값 (String, Number, Boolean 등) - Nullable.of(value)로 처리
        val value = when {
            node.isTextual -> node.asText()
            node.isBoolean -> node.asBoolean()
            node.isInt -> node.asInt()
            node.isLong -> node.asLong()
            node.isDouble -> node.asDouble()
            else -> node.toString()
        }
        return Nullable.of(value)
    }
}
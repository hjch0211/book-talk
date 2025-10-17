package kr.co.booktalk

import com.fasterxml.jackson.annotation.JsonCreator
import com.fasterxml.jackson.annotation.JsonValue

/** Null과 Absent를 구별 */
data class Nullable<T> private constructor(val isPresent: Boolean, val value: T?) {
    companion object {
        @JsonCreator
        @JvmStatic
        fun <T> of(value: T?): Nullable<T> = Nullable(true, value)

        fun <T> absent(): Nullable<T> = Nullable(false, null)
    }

    @JsonValue
    fun toJson(): T? = if (isPresent) value else null
}
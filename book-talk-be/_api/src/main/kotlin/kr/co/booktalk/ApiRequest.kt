package kr.co.booktalk

/** Null과 Absent를 구별 */
data class Nullable<T>(val isPresent: Boolean, val value: T?) {
    companion object {
        fun <T> of(value: T?): Nullable<T> = Nullable(true, value)
        fun <T> absent(): Nullable<T> = Nullable(false, null)
    }
}
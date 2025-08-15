package kr.co.booktalk

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class BookTalkApplication

fun main(args: Array<String>) {
    runApplication<BookTalkApplication>(*args)
}

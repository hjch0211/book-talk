package kr.co.booktalk

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class BookTalkApiApplication

fun main(args: Array<String>) {
    runApplication<BookTalkApiApplication>(*args)
}

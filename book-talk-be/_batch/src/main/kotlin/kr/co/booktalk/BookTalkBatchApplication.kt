package kr.co.booktalk

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class BookTalkBatchApplication

fun main(args: Array<String>) {
    runApplication<BookTalkBatchApplication>(*args)
}
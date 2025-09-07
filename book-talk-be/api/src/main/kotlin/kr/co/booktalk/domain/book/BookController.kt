package kr.co.booktalk.domain.book

import kr.co.booktalk.ApiResult
import kr.co.booktalk.domain.auth.AuthAccount
import kr.co.booktalk.toResult
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.ModelAttribute
import org.springframework.web.bind.annotation.RestController

@RestController
class BookController(
    private val bookService: BookService
) {
    /** 책 검색  */
    @GetMapping("/books?query={query}&page={page}&size={size}")
    fun searchBook(
        @ModelAttribute request: SearchBookRequest,
        authAccount: AuthAccount
    ): ApiResult<SearchBookResponse> {
        request.validate()
        return bookService.search(request).toResult()
    }
}
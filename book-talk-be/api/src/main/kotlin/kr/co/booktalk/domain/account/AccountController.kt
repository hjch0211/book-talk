package kr.co.booktalk.domain.account

import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController

@RestController
class AccountController(
    private val accountService: AccountService
) {
    @PostMapping("/accounts")
    fun create(@RequestBody request: CreateRequest) {
        accountService.create(request)
    }
}
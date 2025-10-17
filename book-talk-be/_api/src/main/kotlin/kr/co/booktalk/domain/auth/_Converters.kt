package kr.co.booktalk.domain.auth

import kr.co.booktalk.domain.account.CreateRequest

fun SignUpRequest.toAccountCreateRequest() = CreateRequest(
    name = this.name,
)
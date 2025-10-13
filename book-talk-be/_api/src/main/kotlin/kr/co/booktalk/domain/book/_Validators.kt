package kr.co.booktalk.domain.book

fun SearchBookRequest.validate() {
    require(query.isNotBlank()) { "검색어는 비어있을 수 없습니다." }
    require((page ?: 1) > 0) { "페이지는 1 이상이어야 합니다." }
    require((size ?: 10) in 1..50) { "크기는 1 이상 50 이하여야 합니다." }
}
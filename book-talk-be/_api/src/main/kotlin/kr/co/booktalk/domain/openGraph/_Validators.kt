package kr.co.booktalk.domain.openGraph

fun FetchOpenGraphRequest.validate() {
    require(url.isNotBlank()) { "URL이 비어있습니다." }
    require(url.startsWith("http://") || url.startsWith("https://")) { "유효한 URL 형식이 아닙니다." }
}
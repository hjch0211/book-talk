package kr.co.booktalk.domain.survey

fun CreateSurveyRequest.validate() {
    require(rate in 1..10) { "점수는 1~10 사이의 값이어야 합니다." }
}
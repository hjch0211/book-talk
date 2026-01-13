package kr.co.booktalk.domain.survey

fun CreateSurveyRequest.validate() {
    require(rate in 1..5) { "점수는 1~5 사이의 값이어야 합니다." }
}
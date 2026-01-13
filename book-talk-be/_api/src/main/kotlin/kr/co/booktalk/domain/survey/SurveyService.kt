package kr.co.booktalk.domain.survey

import kr.co.booktalk.domain.AccountRepository
import kr.co.booktalk.domain.SurveyRepository
import kr.co.booktalk.domain.SurveyEntity
import kr.co.booktalk.domain.auth.AuthAccount
import kr.co.booktalk.httpBadRequest
import kr.co.booktalk.toUUID
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class SurveyService(
    private val accountRepository: AccountRepository,
    private val surveyRepository: SurveyRepository,
) {
    @Transactional
    fun create(request: CreateSurveyRequest, authAccount: AuthAccount): CreateSurveyResponse {
        val account = accountRepository.findByIdOrNull(authAccount.id.toUUID())
            ?: httpBadRequest("존재하지 않는 사용자입니다.")

        val survey = surveyRepository.save(
            SurveyEntity(
                account = account,
                rate = request.rate
            )
        )

        return CreateSurveyResponse(survey.id)
    }
}
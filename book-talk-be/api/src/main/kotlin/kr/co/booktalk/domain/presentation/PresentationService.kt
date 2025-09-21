package kr.co.booktalk.domain.presentation

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import com.github.fge.jsonpatch.JsonPatch
import kr.co.booktalk.domain.AccountRepository
import kr.co.booktalk.domain.PresentationRepository
import kr.co.booktalk.domain.auth.AuthAccount
import kr.co.booktalk.httpBadRequest
import kr.co.booktalk.toUUID
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class PresentationService(
    private val accountRepository: AccountRepository,
    private val presentationRepository: PresentationRepository,
    private val objectMapper: ObjectMapper
) {
    fun findOne(id: String): FindOneResponse {
        return presentationRepository.findByIdOrNull(id.toUUID())?.toResponse() ?: httpBadRequest("존재하지 않는 프레젠테이션입니다.")
    }

    @Transactional
    fun patchContent(id: String, patch: JsonPatch, authAccount: AuthAccount) {
        accountRepository.findByIdOrNull(authAccount.id.toUUID())
            ?: httpBadRequest("존재하지 않는 사용자입니다.")
        val presentation = presentationRepository.findByIdOrNull(id.toUUID())
            ?.validateUpdatable(authAccount)
            ?: httpBadRequest("존재하지 않는 프레젠테이션입니다.")

        val currentNode: JsonNode = try {
            objectMapper.readTree(presentation.content)
        } catch (e: Exception) {
            httpBadRequest("기존 content가 유효한 JSON 형식이 아닙니다.", e)
        }

        val patchedNode: JsonNode = try {
            patch.apply(currentNode)
        } catch (e: Exception) {
            httpBadRequest("JSON Patch 적용 실패: ${e.message}", e)
        }

        presentation.content = objectMapper.writeValueAsString(patchedNode)
    }
}
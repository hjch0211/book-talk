package kr.co.booktalk.domain.account

import kr.co.booktalk.bcrypt
import kr.co.booktalk.domain.AccountRepository
import kr.co.booktalk.domain.DebateChatRepository
import kr.co.booktalk.domain.DebateMemberRepository
import kr.co.booktalk.domain.DebateNotificationRepository
import kr.co.booktalk.domain.DebateRepository
import kr.co.booktalk.domain.DebateRoundRepository
import kr.co.booktalk.domain.DebateRoundSpeakerRepository
import kr.co.booktalk.domain.PresentationRepository
import kr.co.booktalk.domain.SurveyRepository
import kr.co.booktalk.domain.auth.AuthAccount
import kr.co.booktalk.httpBadRequest
import kr.co.booktalk.matchesBcrypt
import kr.co.booktalk.toUUID
import java.time.Instant
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class AccountService(
    private val accountRepository: AccountRepository,
    private val debateRepository: DebateRepository,
    private val debateMemberRepository: DebateMemberRepository,
    private val surveyRepository: SurveyRepository,
    private val presentationRepository: PresentationRepository,
    private val debateChatRepository: DebateChatRepository,
    private val debateRoundSpeakerRepository: DebateRoundSpeakerRepository,
    private val debateNotificationRepository: DebateNotificationRepository,
    private val debateRoundRepository: DebateRoundRepository,
) {
    fun findMy(authAccount: AuthAccount): FindMyResponse {
        return accountRepository.findByIdOrNull(authAccount.id.toUUID())?.toResponse()
            ?: httpBadRequest("존재하지 않는 계정입니다.")
    }

    @Transactional
    fun patchMy(authAccount: AuthAccount, request: PatchMyRequest) {
        val me = accountRepository.findByIdOrNull(authAccount.id.toUUID()) ?: httpBadRequest("존재하지 않는 계정입니다.")
        if (accountRepository.existsByName(request.name)) httpBadRequest("이미 사용 중인 이름입니다.")
        me.name = request.name
    }

    @Transactional
    fun patchMyPassword(authAccount: AuthAccount, request: PatchMyPasswordRequest) {
        val me = accountRepository.findByIdOrNull(authAccount.id.toUUID()) ?: httpBadRequest("존재하지 않는 계정입니다.")
        val currentPassword = me.password ?: httpBadRequest("소셜 로그인 계정은 비밀번호를 변경할 수 없습니다.")
        if (!request.currentPassword.matchesBcrypt(currentPassword)) httpBadRequest("현재 비밀번호가 일치하지 않습니다.")
        me.password = request.newPassword.bcrypt()
    }

    @Transactional
    fun archiveMyAccount(authAccount: AuthAccount) {
        val me = accountRepository.findByIdOrNull(authAccount.id.toUUID()) ?: httpBadRequest("존재하지 않는 계정입니다.")
        val now = Instant.now()

        val hostedDebates = debateRepository.findAllByHost(me)

        debateRoundRepository.clearNextSpeakerByAccount(me)
        debateRoundSpeakerRepository.archiveAllByAccount(me, now)
        debateChatRepository.archiveAllByAccount(me, now)
        presentationRepository.archiveAllByAccount(me, now)
        debateMemberRepository.archiveAllByAccount(me, now)
        if (hostedDebates.isNotEmpty()) {
            debateNotificationRepository.archiveAllByDebateIn(hostedDebates, now)
        }
        debateRepository.archiveAllByHost(me, now)
        surveyRepository.archiveAllByAccount(me, now)

        me.archivedAt = now
        me.refreshToken = null
    }
}

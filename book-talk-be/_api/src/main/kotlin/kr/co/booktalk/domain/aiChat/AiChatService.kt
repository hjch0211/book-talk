package kr.co.booktalk.domain.aiChat

import io.github.oshai.kotlinlogging.KotlinLogging
import kotlinx.coroutines.CoroutineName
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.async
import kotlinx.coroutines.launch
import kr.co.booktalk.client.AiClient
import kr.co.booktalk.client.AiSearchRequest
import kr.co.booktalk.coroutineGlobalExceptionHandler
import kr.co.booktalk.domain.AccountRepository
import kr.co.booktalk.domain.AiChatEntity
import kr.co.booktalk.domain.AiChatMemberEntity
import kr.co.booktalk.domain.AiChatMemberRepository
import kr.co.booktalk.domain.AiChatMessageEntity
import kr.co.booktalk.domain.AiChatMessageRepository
import kr.co.booktalk.domain.AiChatPersonaRepository
import kr.co.booktalk.domain.AiChatRepository
import kr.co.booktalk.domain.AiChatSearchResultEntity
import kr.co.booktalk.domain.AiChatSearchResultRepository
import kr.co.booktalk.domain.AiChatSearchResultType
import kr.co.booktalk.domain.AiChatSearchResultType.BLOG
import kr.co.booktalk.domain.AiChatSearchResultType.NEWS
import kr.co.booktalk.domain.DebateRepository
import kr.co.booktalk.domain.auth.AuthAccount
import kr.co.booktalk.httpBadRequest
import kr.co.booktalk.toUUID
import jakarta.annotation.PreDestroy
import org.springframework.data.repository.findByIdOrNull
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class AiChatService(
    private val aiChatRepository: AiChatRepository,
    private val aiChatMessageRepository: AiChatMessageRepository,
    private val aiChatPersonaRepository: AiChatPersonaRepository,
    private val debateRepository: DebateRepository,
    private val aiChatRealtimeService: AiChatRealtimeService,
    private val aiChatMemberRepository: AiChatMemberRepository,
    private val accountRepository: AccountRepository,
    private val aiChatSearchResultRepository: AiChatSearchResultRepository,
    private val aiClient: AiClient,
) {
    private val logger = KotlinLogging.logger {}
    private val scope = CoroutineScope(
        SupervisorJob() + Dispatchers.IO + CoroutineName("ai-chat-service") + coroutineGlobalExceptionHandler
    )

    @PreDestroy
    fun destroy() { scope.cancel() }

    fun create(request: CreateAiChatRequest, authAccount: AuthAccount): CreateAiChatResponse {
        val debate = debateRepository.findByIdOrNull(request.debateId.toUUID())
            ?: httpBadRequest("토론을 찾을 수 없습니다.")
        val account = accountRepository.findByIdOrNull((authAccount.id).toUUID())
            ?: httpBadRequest("존재하지 않는 계정입니다.")

        val chat = aiChatRepository.saveAndFlush(AiChatEntity(debate = debate, personaId = request.persona, name = request.name))
        aiChatMemberRepository.save(AiChatMemberEntity(chat = chat, account = account))

        scope.launch {
            try {
                val newsDeferred = async {
                    aiClient.searchWithAi(AiSearchRequest(
                        bookTitle = debate.book.title,
                        topic = debate.topic,
                        includeDomains = NEWS_DOMAINS,
                    ))
                }
                val blogDeferred = async {
                    aiClient.searchWithAi(AiSearchRequest(
                        bookTitle = debate.book.title,
                        topic = debate.topic,
                        includeDomains = BLOG_DOMAINS,
                    ))
                }
                val entities = newsDeferred.await().map {
                    AiChatSearchResultEntity(chat = chat, type = AiChatSearchResultType.NEWS,
                        title = it.title, url = it.url, content = it.content)
                } + blogDeferred.await().map {
                    AiChatSearchResultEntity(chat = chat, type = AiChatSearchResultType.BLOG,
                        title = it.title, url = it.url, content = it.content)
                }
                aiChatSearchResultRepository.saveAll(entities)
            } catch (e: Exception) {
                logger.error(e) { "AI 검색 결과 저장 실패 - chatId=${chat.id}" }
            }
        }

        return CreateAiChatResponse(chatId = chat.id.toString())
    }

    @Transactional(readOnly = true)
    fun findOne(chatId: String): FindOneAiChatResponse {
        val chat = aiChatRepository.findByIdOrNull(chatId.toUUID())
            ?: httpBadRequest("채팅방을 찾을 수 없습니다.")
        val members = aiChatMemberRepository.findByChatId(chat.id!!)
        if (members.isEmpty()) httpBadRequest("채팅방 멤버를 찾을 수 없습니다.")

        val host = members.first()
        val persona = aiChatPersonaRepository.findByIdOrNull(chat.personaId)
            ?: httpBadRequest("페르소나를 찾을 수 없습니다.")
        val messages = aiChatMessageRepository.findByChatIdOrderByCreatedAtAsc(chat.id!!)
        val searchResults = aiChatSearchResultRepository.findByChatIdOrderByCreatedAtAsc(chat.id!!)

        return FindOneAiChatResponse(
            chatId = chat.id.toString(),
            debateId = chat.debate.id.toString(),
            personaId = chat.personaId,
            agentId = persona.agentId,
            name = chat.name,
            member = FindOneAiChatResponse.MemberInfo(
                accountId = host.account.id.toString(),
                accountName = host.account.name,
            ),
            debateInfo = FindOneAiChatResponse.DebateInfo(
                topic = chat.debate.topic,
                bookTitle = chat.debate.book.title,
                bookDescription = chat.debate.book.description,
            ),
            searchResults = FindOneAiChatResponse.SearchResults(
                news = searchResults.filter { it.type == NEWS }.map {
                    FindOneAiChatResponse.SearchResultItem(title = it.title, url = it.url, content = it.content)
                },
                blog = searchResults.filter { it.type == BLOG }.map {
                    FindOneAiChatResponse.SearchResultItem(title = it.title, url = it.url, content = it.content)
                },
            ),
            messages = messages.map {
                FindOneAiChatResponse.MessageInfo(
                    id = it.id.toString(),
                    role = it.role,
                    content = it.content,
                    status = it.status.name,
                    createdAt = it.createdAt,
                )
            },
            createdAt = chat.createdAt,
        )
    }

    fun onUserMessageSaved(chatId: String) {
        val members = aiChatMemberRepository.findByChatId(chatId.toUUID())
        if (members.isEmpty()) httpBadRequest("채팅방 멤버를 찾을 수 없습니다.")

        val host = members.first()
        aiChatRealtimeService.sendUserMessageSaved(chatId, host.account.id.toString())
    }

    fun remove(chatId: String) {
        val chat = aiChatRepository.findByIdOrNull(chatId.toUUID())
            ?: httpBadRequest("채팅방을 찾을 수 없습니다.")
        aiChatMessageRepository.deleteAllByChat(chat)
        aiChatMemberRepository.deleteAllByChat(chat)
        aiChatRepository.delete(chat)
    }

    fun saveChat(saveChatRequest: SaveChatRequest) {
        val chat = aiChatRepository.findByIdOrNull(saveChatRequest.chatId.toUUID())
            ?: httpBadRequest("채팅방을 찾을 수 없습니다.")
        aiChatMessageRepository.save(AiChatMessageEntity(
            chat = chat,
            role = saveChatRequest.role,
            content = saveChatRequest.message,
        ))
        aiChatRealtimeService.sendChatSaved(saveChatRequest.chatId, saveChatRequest.accountId)
    }

    companion object {
        private val NEWS_DOMAINS = listOf(
            "chosun.com", "joongang.co.kr", "donga.com", "hani.co.kr", "khan.co.kr",
            "hankookilbo.com", "mk.co.kr", "hankyung.com", "sedaily.com", "fnnews.com",
            "kbs.co.kr", "mbc.co.kr", "sbs.co.kr", "ytn.co.kr", "yna.co.kr", "edaily.co.kr",
        )
        private val BLOG_DOMAINS = listOf(
            "blog.naver.com", "tistory.com", "brunch.co.kr",
        )
    }
}

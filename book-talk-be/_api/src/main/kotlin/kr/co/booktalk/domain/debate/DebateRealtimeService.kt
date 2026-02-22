package kr.co.booktalk.domain.debate

import com.fasterxml.jackson.databind.ObjectMapper
import io.github.oshai.kotlinlogging.KotlinLogging
import jakarta.annotation.PreDestroy
import kotlinx.coroutines.CoroutineName
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.cancel
import kotlinx.coroutines.launch
import kr.co.booktalk.cache.DebateOnlineAccountsCache
import kr.co.booktalk.cache.HandRaiseCache
import kr.co.booktalk.cache.WebSocketSessionCache
import kr.co.booktalk.config.AppProperties
import kr.co.booktalk.domain.DebateRoundEntity
import kr.co.booktalk.client.MonitorClient
import kr.co.booktalk.client.SendRequest
import kr.co.booktalk.coroutineGlobalExceptionHandler
import kr.co.booktalk.realtime.BaseRealtimeService
import org.springframework.stereotype.Service

@Service
class DebateRealtimeService(
    private val debateOnlineAccountsCache: DebateOnlineAccountsCache,
    private val handRaiseCache: HandRaiseCache,
    webSocketSessionCache: WebSocketSessionCache,
    monitorClient: MonitorClient,
    objectMapper: ObjectMapper,
    private val appProperties: AppProperties
) : BaseRealtimeService(
    webSocketSessionCache = webSocketSessionCache,
    monitorClient = monitorClient,
    objectMapper = objectMapper,
    scope = CoroutineScope(
        SupervisorJob() + Dispatchers.IO + CoroutineName("debate-realtime-service") + coroutineGlobalExceptionHandler
    ),
) {
    private val logger = KotlinLogging.logger {}

    @PreDestroy
    fun destroy() {
        scope.cancel()
    }

    fun broadcastOnlineAccountUpdate(debateId: String) {
        val onlineAccounts = debateOnlineAccountsCache.get(debateId)
        val response = DebateOnlineAccountsUpdateResponse(
            payload = DebateOnlineAccountsUpdateResponse.Payload(
                debateId = debateId,
                onlineAccounts = onlineAccounts
            )
        )
        broadcastToDebateRoom(debateId, objectMapper.writeValueAsString(response))
    }

    fun broadcastHandRaiseUpdate(debateId: String) {
        val onlineAccountIds = debateOnlineAccountsCache.get(debateId)

        val raisedHandsList = onlineAccountIds.mapNotNull { accountId ->
            val raisedAt = handRaiseCache.get(debateId, accountId)
                ?: return@mapNotNull null

            HandRaiseUpdateResponse.Payload.RaisedHandInfo(
                accountId = accountId,
                raisedAt = raisedAt.toEpochMilli()
            )
        }

        val response = HandRaiseUpdateResponse(
            payload = HandRaiseUpdateResponse.Payload(
                debateId = debateId,
                raisedHands = raisedHandsList
            )
        )
        broadcastToDebateRoom(debateId, objectMapper.writeValueAsString(response))
    }

    fun broadcastChatMessage(debateId: String, chatId: Long) {
        val response = ChatMessageResponse(
            payload = ChatMessageResponse.Payload(
                debateId = debateId,
                chatId = chatId
            )
        )
        broadcastToDebateRoom(debateId, objectMapper.writeValueAsString(response))
    }

    fun broadcastDebateRoundUpdate(debateId: String, debateRound: DebateRoundEntity) {
        val response = DebateRoundUpdateResponse(
            payload = DebateRoundUpdateResponse.Payload(
                debateId = debateId,
                round = DebateRoundUpdateResponse.Payload.RoundInfo(
                    id = debateRound.id,
                    type = debateRound.type.name,
                    nextSpeakerId = null,
                    nextSpeakerName = null,
                    createdAt = debateRound.createdAt.toEpochMilli(),
                    endedAt = debateRound.endedAt?.toEpochMilli()
                ),
                currentSpeaker = DebateRoundUpdateResponse.Payload.CurrentSpeakerInfo(
                    accountId = null,
                    accountName = null,
                    endedAt = System.currentTimeMillis() + appProperties.debate.roundSpeakerSeconds * 1000
                )
            )
        )
        broadcastToDebateRoom(debateId, objectMapper.writeValueAsString(response))
    }

    fun broadcastVoiceJoin(debateId: String, accountId: String) {
        val response = VoiceJoinResponse(
            payload = VoiceJoinResponse.Payload(
                debateId = debateId,
                fromId = accountId
            )
        )
        broadcastToDebateRoom(debateId, objectMapper.writeValueAsString(response))
    }

    fun broadcastSpeakerUpdate(debateId: String, response: SpeakerUpdateResponse) {
        broadcastToDebateRoom(debateId, objectMapper.writeValueAsString(response))
    }

    fun broadcastAiSummaryCompleted(debateId: String) {
        val response = AiSummaryCompletedResponse(
            payload = AiSummaryCompletedResponse.Payload(
                debateId = debateId
            )
        )
        broadcastToDebateRoom(debateId, objectMapper.writeValueAsString(response))
    }

    private fun broadcastToDebateRoom(debateId: String, messageJson: String) {
        try {
            val accountIds = debateOnlineAccountsCache.get(debateId)
            val targetSessions = webSocketSessionCache.getAll(accountIds)

            targetSessions.forEach { session ->
                sendTextMessage(session, messageJson)
            }
        } catch (e: Exception) {
            logger.error(e) { "토론방 브로드캐스트 실패: debateId=$debateId, messageJson=$messageJson" }
            scope.launch {
                monitorClient.send(
                    SendRequest(
                        title = "[book-talk-api] INTERNAL SERVER ERROR",
                        message = "${e.message}",
                        stackTrace = e.stackTraceToString(),
                        level = SendRequest.Level.ERROR
                    )
                )
            }
        }
    }
}
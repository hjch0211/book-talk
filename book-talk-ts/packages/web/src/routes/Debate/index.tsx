import { AudioActivationBanner, AudioPlayer } from '@src/components';
import { useDebate } from '@src/hooks';
import { Suspense, useState } from 'react';
import { useParams } from 'react-router-dom';
import MainContainer from '../../components/templates/MainContainer';
import { DebateHeader } from './_components/DebateHeader';
import { DebateMemberList } from './_components/DebateMemberList';
import { DebatePresentation } from './_components/DebatePresentation';
import { DebateSkeleton } from './_components/DebateSkeleton';
import StartDebateModal from './_components/modal/StartDebateModal.tsx';
import { RoundActions } from './_components/RoundActions';
import { RoundStartBackdrop } from './_components/RoundStartBackdrop';
import { DebateContainer } from './style.ts';

type RoundType = 'PREPARATION' | 'PRESENTATION' | 'FREE';

interface Props {
  debateId: string | undefined;
}

function DebatePageContent({ debateId }: Props) {
  const [showStartModal, setShowStartModal] = useState(false);

  const {
    debate,
    myMemberData,
    currentRoundInfo,
    round,
    websocket,
    voiceChat,
    chat,
    showRoundStartBackdrop,
    closeRoundStartBackdrop,
    handleStartDebate,
  } = useDebate({ debateId });

  const onStartDebateConfirm = () => {
    setShowStartModal(false);
    void handleStartDebate();
  };

  /** PRESENTATION 라운드에서 발언 조기 종료 */
  const handleEndPresentation = async () => {
    const currentSpeakerId = debate.currentRound?.currentSpeakerId;
    if (currentRoundInfo.type !== 'PRESENTATION' || !currentSpeakerId) return;

    try {
      await round.patchRoundSpeakerMutation.mutateAsync({
        debateRoundSpeakerId: currentSpeakerId,
        ended: true,
      });
    } catch (error) {
      console.error('Failed to end presentation:', error);
    }
  };

  const handlePassSpeaker = async (memberId: string) => {
    if (!currentRoundInfo.id) return;

    try {
      await round.createRoundSpeakerMutation.mutateAsync({
        debateRoundId: currentRoundInfo.id,
        nextSpeakerId: memberId,
      });
    } catch (error) {
      console.error('Failed to pass speaker:', error);
    }
  };

  if (!debateId) {
    return <div>Invalid debate ID</div>;
  }

  // PENDING 또는 FAILED 상태일 때 스켈레톤 표시
  if (voiceChat.connectionStatus === 'PENDING' || voiceChat.connectionStatus === 'FAILED') {
    return <DebateSkeleton connectionStatus={voiceChat.connectionStatus} />;
  }

  return (
    <MainContainer isAuthPage>
      <DebateContainer>
        <DebateHeader topic={debate.topic} />
        <DebatePresentation
          currentRoundInfo={currentRoundInfo}
          currentSpeaker={round.currentSpeaker}
          debateId={debateId}
          myAccountId={myMemberData.id}
          onChatMessage={websocket.sendChatMessage}
          chat={chat}
          members={debate.members}
          presentations={debate.presentations}
        />
        <DebateMemberList
          members={websocket.membersWithPresence}
          currentSpeaker={round.currentSpeaker}
          nextSpeaker={round.nextSpeaker}
          realTimeRemainingSeconds={round.realTimeRemainingSeconds}
          raisedHands={websocket.raisedHands}
          currentRoundType={currentRoundInfo.type}
          myAccountId={myMemberData.id}
          onPassSpeaker={handlePassSpeaker}
          presentations={debate.presentations}
        />
        <RoundActions
          roundType={currentRoundInfo.type as RoundType}
          myRole={myMemberData.role || ''}
          isCurrentSpeaker={round.currentSpeaker?.accountId === myMemberData.id}
          onStartDebate={() => setShowStartModal(true)}
          onEndPresentation={handleEndPresentation}
          onToggleHand={websocket.toggleHand}
          isMyHandRaised={myMemberData.id ? websocket.isHandRaised(myMemberData.id) : false}
          isVoiceChatJoined={voiceChat.connectionStatus === 'COMPLETED'}
          isVoiceMuted={voiceChat.isMuted}
          onToggleMute={voiceChat.toggleMute}
        />

        <StartDebateModal
          open={showStartModal}
          onClose={() => setShowStartModal(false)}
          onConfirm={onStartDebateConfirm}
          isLoading={round.updateDebateMutation.isPending}
        />

        <RoundStartBackdrop
          show={showRoundStartBackdrop.show}
          roundType={showRoundStartBackdrop.type}
          onClose={closeRoundStartBackdrop}
        />

        {/* 음성 채팅 (PREPARATION 라운드 제외) */}
        {currentRoundInfo.type !== 'PREPARATION' && (
          <>
            {/* 각 원격 스트림을 개별 audio element로 재생 (브라우저가 자동 믹싱) */}
            {voiceChat.remoteStreams.map((rs) => (
              <AudioPlayer
                key={rs.peerId}
                stream={rs.stream}
                isAudioActive={voiceChat.isAudioActive}
                onAutoplayBlocked={voiceChat.onAutoplayBlocked}
              />
            ))}
            <AudioActivationBanner
              open={!voiceChat.isAudioActive && voiceChat.remoteStreams.length > 0}
              onActivate={voiceChat.activateAudio}
            />
          </>
        )}
      </DebateContainer>
    </MainContainer>
  );
}

export function DebatePage() {
  const { debateId } = useParams<{ debateId: string }>();

  return (
    <Suspense key={debateId} fallback={<></>}>
      <DebatePageContent debateId={debateId} />
    </Suspense>
  );
}

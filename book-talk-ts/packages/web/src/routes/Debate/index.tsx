import { AudioActivationBanner, AudioPlayer } from '@src/components';
import { type RoundType, useDebate, useModal } from '@src/hooks';
import { Suspense } from 'react';
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

interface Props {
  debateId: string | undefined;
}

function DebatePageContent({ debateId }: Props) {
  const { openModal, closeModal } = useModal();

  const {
    debate,
    myMemberInfo,
    currentRoundInfo,
    round,
    websocket,
    voiceChat,
    chat,
    roundStartBackdrop,
    handleStartDebate,
  } = useDebate({ debateId });

  const handleOpenStartModal = () => {
    openModal(StartDebateModal, {
      onConfirm: () => {
        closeModal();
        void handleStartDebate();
      },
      isLoading: round.isUpdating,
    });
  };

  if (!debateId) {
    return <div>유효하지 않는 id입니다.</div>;
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
          myAccountId={myMemberInfo?.id}
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
          myAccountId={myMemberInfo?.id}
          onPassSpeaker={round.passSpeaker}
          presentations={debate.presentations}
        />
        <RoundActions
          roundType={currentRoundInfo.type as RoundType}
          myRole={myMemberInfo?.role || ''}
          isCurrentSpeaker={round.currentSpeaker?.accountId === myMemberInfo?.id}
          onStartDebate={handleOpenStartModal}
          onEndPresentation={round.endPresentation}
          onToggleHand={websocket.toggleHand}
          isMyHandRaised={myMemberInfo?.id ? websocket.isHandRaised(myMemberInfo.id) : false}
          isVoiceChatJoined={voiceChat.connectionStatus === 'COMPLETED'}
          isVoiceMuted={voiceChat.isMuted}
          onToggleMute={voiceChat.toggleMute}
        />

        <RoundStartBackdrop
          show={roundStartBackdrop.show}
          roundType={roundStartBackdrop.type}
          onClose={roundStartBackdrop.close}
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
    <Suspense key={debateId} fallback={<DebateSkeleton connectionStatus={'NOT_STARTED'} />}>
      <DebatePageContent debateId={debateId} />
    </Suspense>
  );
}

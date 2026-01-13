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
    connection,
    voiceChatUI,
    chat,
    roundStartBackdrop,
    handleStartDebate,
    handleEndDebate,
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

  if (
    (connection.onlineMembers.length > 1 && connection.voiceConnectionStatus === 'PENDING') ||
    connection.voiceConnectionStatus === 'FAILED'
  ) {
    return (
      <>
        <RoundStartBackdrop
          show={roundStartBackdrop.show}
          roundType={roundStartBackdrop.type}
          onClose={roundStartBackdrop.close}
        />
        <DebateSkeleton connectionStatus={connection.voiceConnectionStatus} />
      </>
    );
  }

  return (
    <MainContainer isAuthPage>
      <DebateContainer>
        <DebateHeader
          topic={debate.topic}
          isHost={myMemberInfo?.role === 'HOST'}
          endDebate={handleEndDebate}
        />
        <DebatePresentation
          currentRoundInfo={currentRoundInfo}
          debateId={debateId}
          myAccountId={myMemberInfo?.id}
          onChatMessage={connection.sendChatMessage}
          chat={chat}
          members={debate.members}
          presentations={debate.presentations}
        />
        <DebateMemberList
          currentSpeaker={currentRoundInfo.currentSpeaker}
          nextSpeaker={currentRoundInfo.nextSpeaker}
          members={connection.onlineMembers}
          realTimeRemainingSeconds={round.realTimeRemainingSeconds}
          raisedHands={connection.raisedHands}
          currentRoundType={currentRoundInfo.type}
          myAccountId={myMemberInfo?.id}
          onPassSpeaker={round.passSpeaker}
          presentations={debate.presentations}
        />
        <RoundActions
          roundType={currentRoundInfo.type as RoundType}
          myRole={myMemberInfo?.role || ''}
          isCurrentSpeaker={debate.currentRoundInfo.currentSpeaker?.accountId === myMemberInfo?.id}
          onStartDebate={handleOpenStartModal}
          onEndPresentation={round.endPresentation}
          onToggleHand={connection.toggleHand}
          isMyHandRaised={myMemberInfo?.id ? connection.isHandRaised(myMemberInfo.id) : false}
          isVoiceChatJoined={connection.voiceConnectionStatus === 'COMPLETED'}
          isVoiceMuted={voiceChatUI.isMuted}
          onToggleMute={voiceChatUI.toggleMute}
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
            {connection.remoteStreams.map((rs) => (
              <AudioPlayer
                key={rs.peerId}
                stream={rs.stream}
                isAudioActive={voiceChatUI.isAudioActive}
                onAutoplayBlocked={voiceChatUI.onAutoplayBlocked}
              />
            ))}
            <AudioActivationBanner
              open={!voiceChatUI.isAudioActive && connection.remoteStreams.length > 0}
              onActivate={voiceChatUI.activateAudio}
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

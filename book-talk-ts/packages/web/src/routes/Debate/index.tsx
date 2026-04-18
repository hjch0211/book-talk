import { AudioPlayer } from '@src/components/molecules/AudioPlayer';
import { SuspenseErrorBoundary } from '@src/components/molecules/SuspenseErrorBoundary';
import { AudioActivationBanner } from '@src/components/organisms/AudioActivationBanner';
import { meQueryOption } from '@src/externals/account';
import { type RoundType, useDebate, useModal } from '@src/hooks';
import type { VoiceConnectionStatus } from '@src/hooks/domain/useDebateRealtimeConnection.tsx';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import PageContainer from '../../components/templates/PageContainer';
import { DebateHeader } from './_components/DebateHeader';
import { DebateMemberList } from './_components/DebateMemberList';
import { DebatePresentation } from './_components/DebatePresentation';
import { DebateSkeleton } from './_components/DebateSkeleton';
import StartDebateModal from './_components/modal/StartDebateModal.tsx';
import { RoundActions } from './_components/RoundActions';
import { RoundStartBackdrop } from './_components/RoundStartBackdrop';
import { ContentRow, DebateContainer, MemberColumn } from './style.ts';

interface Props {
  debateId: string | undefined;
}

function DebatePageContent({ debateId }: Props) {
  const { openModal, closeModal } = useModal();

  const { data: me } = useSuspenseQuery(meQueryOption);
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

  if (!me) {
    return <DebateSkeleton title={''} content={''} />;
  }

  if (
    (connection.onlineMembers.length > 1 && connection.voiceConnectionStatus === 'PENDING') ||
    connection.voiceConnectionStatus === 'FAILED'
  ) {
    const getSkeletonText = (status: VoiceConnectionStatus) => {
      switch (status) {
        case 'PENDING':
          return {
            title: '음성 채팅 연결 중...',
            content: '원활한 음성연결을 위해 크롬 브라우저 사용을 권장드립니다.',
          };
        case 'FAILED':
          return {
            title: '음성 채팅 연결 실패',
            content: '새로고침을 시도해주세요',
          };
        default:
          return {
            title: '토론방에 입장 중...',
            content: '원활한 음성연결을 위해 크롬 브라우저 사용을 권장드립니다.',
          };
      }
    };

    const { title, content } = getSkeletonText(connection.voiceConnectionStatus);

    return (
      <>
        <RoundStartBackdrop
          show={roundStartBackdrop.show}
          roundType={roundStartBackdrop.type}
          onClose={roundStartBackdrop.close}
        />
        <DebateSkeleton title={title} content={content} />
      </>
    );
  }

  return (
    <PageContainer sx={{ height: '100vh' }}>
      <DebateContainer>
        <DebateHeader
          debate={debate}
          isHost={myMemberInfo?.role === 'HOST'}
          endDebate={handleEndDebate}
        />
        <ContentRow>
          <DebatePresentation
            currentRoundInfo={currentRoundInfo}
            debateId={debateId}
            myAccountId={myMemberInfo?.id}
            onChatMessage={connection.sendChatMessage}
            chat={chat}
            members={debate.members}
            presentations={debate.presentations}
          />
          <MemberColumn>
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
              isCurrentSpeaker={
                debate.currentRoundInfo.currentSpeaker?.accountId === myMemberInfo?.id
              }
              onStartDebate={handleOpenStartModal}
              onEndPresentation={round.endPresentation}
              onToggleHand={connection.toggleHand}
              isMyHandRaised={myMemberInfo?.id ? connection.isHandRaised(myMemberInfo.id) : false}
              isVoiceChatJoined={connection.voiceConnectionStatus === 'COMPLETED'}
              isVoiceMuted={voiceChatUI.isMuted}
              onToggleMute={voiceChatUI.toggleMute}
            />
          </MemberColumn>
        </ContentRow>

        <RoundStartBackdrop
          show={roundStartBackdrop.show}
          roundType={roundStartBackdrop.type}
          onClose={roundStartBackdrop.close}
        />

        {/* 음성 채팅 */}
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
      </DebateContainer>
    </PageContainer>
  );
}

export function DebatePage() {
  const { debateId } = useParams<{ debateId: string }>();

  return (
    <SuspenseErrorBoundary
      key={debateId}
      onSuspense={<DebateSkeleton title={'토론방에 입장 중...'} content={'잠시만 기다려주세요'} />}
      onError={
        <DebateSkeleton title={'오류가 발생했습니다'} content={'페이지를 새로고침 해주세요'} />
      }
    >
      <DebatePageContent debateId={debateId} />
    </SuspenseErrorBoundary>
  );
}

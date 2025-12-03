import {Suspense, useState} from 'react';
import {useParams} from 'react-router-dom';
import MainContainer from '../../components/templates/MainContainer';
import {DebateHeader} from './_components/DebateHeader';
import {DebatePresentation} from './_components/DebatePresentation';
import {DebateMemberList} from './_components/DebateMemberList';
import {RoundStartBackdrop} from './_components/RoundStartBackdrop';
import {RoundActions} from './_components/RoundActions';
import {DebateContainer} from './Debate.style';
import {useDebate} from "../../hooks/domain/useDebate.tsx";
import StartDebateModal from "./_components/modal/StartDebateModal.tsx";
import {AudioPlayer} from "../../components/molecules/AudioPlayer";
import {AudioActivationBanner} from "../../components/organisms/AudioActivationBanner";

type RoundType = 'PREPARATION' | 'PRESENTATION' | 'FREE';

interface Props {
    debateId: string | undefined;
}

function DebatePageContent({debateId}: Props) {
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
    } = useDebate({debateId});

    const handleStartDebate = async () => {
        if (!debateId) return;

        setShowStartModal(false);
        await round.handlePresentationRound();
    };

    const handleEndPresentation = () => {
        if (currentRoundInfo.type === 'PRESENTATION') {
            void round.handlePresentationRound();
        }
    };

    const handlePassSpeaker = async (memberId: string) => {
        if (!currentRoundInfo.id) return;

        try {
            await round.createRoundSpeakerMutation.mutateAsync({
                debateRoundId: currentRoundInfo.id,
                nextSpeakerId: memberId
            });
        } catch (error) {
            console.error('Failed to pass speaker:', error);
        }
    };

    if (!debateId) {
        return <div>Invalid debate ID</div>;
    }

    return (
        <MainContainer isAuthPage>
            <DebateContainer>
                <DebateHeader topic={debate.topic}/>
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
                    isVoiceChatJoined={voiceChat.isJoined}
                    isVoiceMuted={voiceChat.isMuted}
                    onToggleMute={voiceChat.toggleMute}
                />

                <StartDebateModal
                    open={showStartModal}
                    onClose={() => setShowStartModal(false)}
                    onConfirm={handleStartDebate}
                    isLoading={round.createRoundMutation.isPending}
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
                        {voiceChat.remoteStreams.map(rs => (
                            <AudioPlayer
                                key={rs.peerId}
                                stream={rs.stream}
                                isAudioActive={voiceChat.isAudioActive}
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
    const {debateId} = useParams<{ debateId: string }>();

    return (
        <Suspense key={debateId} fallback={<></>}>
            <DebatePageContent debateId={debateId}/>
        </Suspense>
    );
}

import {Suspense, useState} from 'react';
import {useParams} from 'react-router-dom';
import {Stack} from '@mui/material';
import MainContainer from '../../components/MainContainer/MainContainer';
import {DebateHeader} from './_components/DebateHeader';
import {DebatePresentation} from './_components/DebatePresentation';
import {DebateMemberList} from './_components/DebateMemberList';
import {RoundStartBackdropContainer} from './_components/RoundStartBackdropContainer';
import {RoundActions} from './_components/RoundActions';
import {DebateContainer} from './Debate.style';
import {useDebate} from "../../hooks/useDebate.tsx";
import StartDebateModal from "./_components/StartDebateModal.tsx";
import {VoiceChatProvider} from "../../contexts/VoiceChatContext";

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
        round: {
            currentSpeaker,
            nextSpeaker,
            realTimeRemainingSeconds,
            createRoundMutation,
            handlePresentationRound,
            createRoundSpeakerMutation
        },
        websocket: {toggleHand, isHandRaised, raisedHands, sendVoiceMessage, sendChatMessage, membersWithPresence},
        chat,
        showRoundStartBackdrop,
        closeRoundStartBackdrop,
        voiceChatHandlerRef
    } = useDebate({
        debateId
    });

    const handleStartDebate = async () => {
        if (!debateId) return;

        setShowStartModal(false);
        await handlePresentationRound();
    };

    const handleEndPresentation = () => {
        if (currentRoundInfo.type === 'PRESENTATION') {
            void handlePresentationRound();
        }
    };

    const handlePassSpeaker = async (memberId: string) => {
        if (!currentRoundInfo.id) return;

        try {
            await createRoundSpeakerMutation.mutateAsync({
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
            <VoiceChatProvider
                debateId={debateId!}
                myAccountId={myMemberData.id!}
                onSignalingMessage={sendVoiceMessage}
                voiceChatHandlerRef={voiceChatHandlerRef}
                participantsList={debate.members.map(member => ({
                    id: member.id,
                    name: member.name
                }))}
            >
                <DebateContainer>
                    <DebateHeader topic={debate.topic}/>
                    <DebatePresentation
                        currentRoundInfo={currentRoundInfo}
                        currentSpeaker={currentSpeaker}
                        debateId={debateId}
                        myAccountId={myMemberData.id}
                        onChatMessage={sendChatMessage}
                        chat={chat}
                    />
                    <DebateMemberList
                        members={membersWithPresence}
                        currentSpeaker={currentSpeaker}
                        nextSpeaker={nextSpeaker}
                        realTimeRemainingSeconds={realTimeRemainingSeconds}
                        raisedHands={raisedHands}
                        currentRoundType={currentRoundInfo.type}
                        myAccountId={myMemberData.id}
                        onPassSpeaker={handlePassSpeaker}
                        presentations={debate.presentations}
                    />
                    <Stack spacing={2}>
                        <RoundActions
                            roundType={currentRoundInfo.type as RoundType}
                            myRole={myMemberData.role || ''}
                            isCurrentSpeaker={currentSpeaker?.accountId === myMemberData.id}
                            onStartDebate={() => setShowStartModal(true)}
                            onEndPresentation={handleEndPresentation}
                            onToggleHand={toggleHand}
                            isMyHandRaised={myMemberData.id ? isHandRaised(myMemberData.id) : false}
                        />
                    </Stack>

                    <StartDebateModal
                        open={showStartModal}
                        onClose={() => setShowStartModal(false)}
                        onConfirm={handleStartDebate}
                        isLoading={createRoundMutation.isPending}
                    />

                    <RoundStartBackdropContainer
                        show={showRoundStartBackdrop.show}
                        roundType={showRoundStartBackdrop.type}
                        onClose={closeRoundStartBackdrop}
                    />
                </DebateContainer>
            </VoiceChatProvider>
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

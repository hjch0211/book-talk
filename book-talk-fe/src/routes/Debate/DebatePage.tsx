import {Suspense, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useParams} from 'react-router-dom';
import {useQueryClient} from "@tanstack/react-query";
import {Stack} from '@mui/material';
import MainContainer from '../../components/MainContainer/MainContainer';
import {DebateHeader} from './_components/DebateHeader';
import {DebatePresentation} from './_components/DebatePresentation';
import {DebateMemberList} from './_components/DebateMemberList';
import {RoundStartBackdropContainer} from './_components/RoundStartBackdropContainer';
import {RoundActions} from './_components/RoundActions';
import {DebateContainer} from './Debate.style';
import {useDebate} from "../../hooks/useDebate.tsx";
import {useDebateWebSocket} from "../../hooks/useDebateWebSocket.tsx";
import {useDebateRoundSpeaker} from "../../hooks/useDebateRoundSpeaker";
import StartDebateModal from "./_components/StartDebateModal.tsx";
import {VoiceChatProvider} from "../../contexts/VoiceChatContext";
import type {WebSocketMessage} from "../../apis/websocket";
import {findOneDebateQueryOptions} from "../../apis/debate";

type RoundType = 'PREPARATION' | 'PRESENTATION' | 'FREE';

interface Props {
    debateId: string | undefined;
}

function DebatePageContent({debateId}: Props) {
    const queryClient = useQueryClient();
    const {
        debate,
        myMemberData,
        currentRoundInfo,
        createRoundMutation,
        createRoundSpeakerMutation
    } = useDebate({debateId});
    const {currentSpeaker, nextSpeaker, realTimeRemainingSeconds} = useDebateRoundSpeaker(debateId || '');
    const [showStartModal, setShowStartModal] = useState(false);
    const [showRoundStartBackdrop, setShowRoundStartBackdrop] = useState<{
        show: boolean;
        type: RoundType | null;
    }>({show: false, type: null});

    const handleRoundStartBackdrop = useCallback((roundType: RoundType) => {
        setShowRoundStartBackdrop({show: true, type: roundType});
        setTimeout(() => {
            setShowRoundStartBackdrop({show: false, type: null});
        }, 5000);
    }, []);

    // VoiceChat 메시지 핸들러를 ref로 저장
    const voiceChatHandlerRef = useRef<((message: WebSocketMessage) => void) | null>(null);

    const handleVoiceSignalingWrapper = useCallback((message: WebSocketMessage) => {
        console.log('Voice signaling received in DebatePage:', message);
        voiceChatHandlerRef.current?.(message);
    }, []);

    const {
        isAccountOnline,
        toggleHand,
        isHandRaised,
        raisedHands,
        sendVoiceMessage
    } = useDebateWebSocket(debateId || null, {
        onRoundStartBackdrop: handleRoundStartBackdrop,
        onVoiceSignaling: handleVoiceSignalingWrapper
    });

    const membersWithPresence = useMemo(() => {
        return debate.members.filter(member => isAccountOnline(member.id));
    }, [debate.members, isAccountOnline]);

    const handleStartDebate = () => {
        if (!debateId) return;

        const host = debate.members.find(m => m.role === "HOST")
        if (host) {
            createRoundMutation.mutate({
                debateId,
                nextSpeakerId: host.id
            });
            setShowStartModal(false);
        }
    };

    /** 라운드 타입별 다음 발표자 생성 로직 */
    const roundHandlers = useMemo(() => ({
        PRESENTATION: {
            async createNextSpeaker() {
                if (!debateId || !currentSpeaker || !currentRoundInfo.id) return;

                const currentIndex = debate.members.findIndex(m => m.id === currentSpeaker.accountId);

                if (currentIndex !== -1 && currentIndex < debate.members.length - 1) {
                    // 다음 발표자로 넘기기
                    const nextSpeakerId = debate.members[currentIndex + 1].id;
                    await createRoundSpeakerMutation.mutateAsync({
                        debateRoundId: currentRoundInfo.id,
                        nextSpeakerId
                    });
                } else {
                    // PRESENTATION 라운드 끝 -> FREE 라운드 생성
                    const hostId = debate.members.find(m => m.role === "HOST")?.id || "";
                    await createRoundMutation.mutateAsync({debateId, nextSpeakerId: hostId});
                }
            },
            shouldAutoProgress: true
        },
        FREE: {
            async createNextSpeaker() {
                if (!debateId || !currentRoundInfo.id || !currentRoundInfo.nextSpeakerId) return;

                await createRoundSpeakerMutation.mutateAsync({
                    debateRoundId: currentRoundInfo.id,
                    nextSpeakerId: currentRoundInfo.nextSpeakerId
                });
            },
            shouldAutoProgress: false
        },
        PREPARATION: {
            async createNextSpeaker() {
                // PREPARATION에서는 다음 발표자 생성 불가
            },
            shouldAutoProgress: false
        }
    }), [debateId, currentSpeaker, currentRoundInfo, debate.members, createRoundSpeakerMutation, createRoundMutation]);

    const createNextSpeaker = useCallback(async () => {
        const handler = roundHandlers[currentRoundInfo.type as RoundType];
        if (!handler) return;

        try {
            await handler.createNextSpeaker();
            console.log('Successfully processed next speaker');
        } catch (error) {
            console.error('Failed to create next speaker:', error);
        } finally {
            void queryClient.invalidateQueries({queryKey: findOneDebateQueryOptions().queryKey});
        }
    }, [roundHandlers, currentRoundInfo.type, queryClient]);

    // 발표 시간 만료시 자동 다음 발표자 처리
    useEffect(() => {
        if (!debateId || !currentSpeaker || !currentRoundInfo.id) return;

        const handler = roundHandlers[currentRoundInfo.type as RoundType];
        const shouldAutoProgress = handler?.shouldAutoProgress && realTimeRemainingSeconds === 0 && currentSpeaker.accountId === myMemberData.id;

        if (shouldAutoProgress) {
            console.log('Speaker time expired, auto-creating next speaker');
            void createNextSpeaker();
        }
    }, [
        realTimeRemainingSeconds,
        currentSpeaker,
        myMemberData.id,
        createNextSpeaker,
        debateId,
        currentRoundInfo.id,
        currentRoundInfo.type,
        roundHandlers
    ]);

    const handleEndPresentation = () => {
        void createNextSpeaker();
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
                    />
                    <DebateMemberList
                        members={membersWithPresence}
                        currentSpeaker={currentSpeaker}
                        nextSpeaker={nextSpeaker}
                        realTimeRemainingSeconds={realTimeRemainingSeconds}
                        raisedHands={raisedHands}
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
                        onClose={() => setShowRoundStartBackdrop({show: false, type: null})}
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

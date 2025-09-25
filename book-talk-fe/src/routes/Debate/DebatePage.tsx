import {Suspense, useCallback, useEffect, useMemo, useState} from 'react';
import {useParams} from 'react-router-dom';
import {useQueryClient} from "@tanstack/react-query";
import MainContainer from '../../components/MainContainer/MainContainer';
import {DebateHeader} from './_components/DebateHeader';
import {DebatePresentation} from './_components/DebatePresentation';
import {DebateMemberList} from './_components/DebateMemberList';
import {ActionButton, DebateContainer} from './Debate.style';
import {useDebate} from "../../hooks/useDebate.tsx";
import {useDebateWebSocket} from "../../hooks/useDebateWebSocket.tsx";
import {useDebateRoundSpeaker} from "../../hooks/useDebateRoundSpeaker";
import StartDebateModal from "./_components/StartDebateModal.tsx";

interface Props {
    debateId?: string
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

    // WebSocket을 통해 발표자 업데이트를 받았을 때 쿼리 무효화
    const handleSpeakerUpdate = useCallback((speakerInfo: unknown) => {
        console.log('Speaker updated via WebSocket:', speakerInfo);
        // 토론 데이터를 다시 가져오도록 쿼리 무효화
        if (debateId) {
            void queryClient.invalidateQueries({queryKey: ['debates', debateId]});
        }
    }, [queryClient, debateId]);

    // WebSocket을 통해 토론 라운드 업데이트를 받았을 때 쿼리 무효화
    const handleDebateRoundUpdate = useCallback((roundInfo: unknown) => {
        console.log('Debate round updated via WebSocket:', roundInfo);
        // 토론 데이터를 다시 가져오도록 쿼리 무효화
        if (debateId) {
            void queryClient.invalidateQueries({queryKey: ['debates', debateId]});
        }
    }, [queryClient, debateId]);

    const handlers = useMemo(() => ({
        onSpeakerUpdate: handleSpeakerUpdate,
        onDebateRoundUpdate: handleDebateRoundUpdate
    }), [handleSpeakerUpdate, handleDebateRoundUpdate]);

    const {isAccountOnline} = useDebateWebSocket(debateId || null, handlers);

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

    // 공통: 다음 발표자 생성 로직
    const createNextSpeaker = useCallback(async () => {
        if (!debateId || !currentSpeaker || !currentRoundInfo.id) return;

        try {
            let nextSpeakerId: string | null = null;

            if (currentRoundInfo.type === "PRESENTATION") {
                // PRESENTATION 타입일 때: 현재 스피커 다음 멤버 찾기
                const currentIndex = debate.members.findIndex(m => m.id === currentSpeaker.accountId);
                if (currentIndex !== -1 && currentIndex < debate.members.length - 1) {
                    nextSpeakerId = debate.members[currentIndex + 1].id;
                } else {
                    console.log('No more members for presentation');
                    await queryClient.invalidateQueries({queryKey: ['debates', debateId]});
                    return;
                }
            } else {
                // 다른 타입일 때: nextSpeakerId 사용
                nextSpeakerId = currentRoundInfo.nextSpeakerId || null;
                if (!nextSpeakerId) {
                    console.log('No next speaker specified');
                    await queryClient.invalidateQueries({queryKey: ['debates', debateId]});
                    return;
                }
            }

            console.log('Creating next speaker:', nextSpeakerId);

            await createRoundSpeakerMutation.mutateAsync({
                debateRoundId: currentRoundInfo.id,
                nextSpeakerId: nextSpeakerId
            });

            console.log('Successfully created next speaker');
        } catch (error) {
            console.error('Failed to create next speaker:', error);
            void queryClient.invalidateQueries({queryKey: ['debates', debateId]});
        }
    }, [debateId, currentSpeaker, currentRoundInfo, debate.members, createRoundSpeakerMutation, queryClient]);

    // 발표 시간 만료시 자동 다음 발표자 처리
    useEffect(() => {
        if (!debateId || !currentSpeaker || !currentRoundInfo.id) return;

        // 시간이 만료되고 현재 사용자가 발표자일 때 자동 처리
        if (realTimeRemainingSeconds === 0 && currentSpeaker.accountId === myMemberData.id) {
            console.log('Speaker time expired, auto-creating next speaker');
            void createNextSpeaker();
        }
    }, [
        realTimeRemainingSeconds,
        currentSpeaker,
        myMemberData.id,
        createNextSpeaker,
        debateId,
        currentRoundInfo.id
    ]);

    const handleEndPresentation = () => {
        void createNextSpeaker();
    };

    if (!debateId) {
        return <div>Invalid debate ID</div>;
    }

    return (
        <MainContainer isAuthPage>
            <DebateContainer>
                <DebateHeader
                    topic={debate.topic}
                />
                <DebatePresentation
                    currentRoundInfo={currentRoundInfo}
                    currentSpeaker={currentSpeaker}
                />
                <DebateMemberList
                    members={membersWithPresence}
                    currentSpeaker={currentSpeaker}
                    nextSpeaker={nextSpeaker}
                    realTimeRemainingSeconds={realTimeRemainingSeconds}
                />
                {
                    currentRoundInfo.type === "PREPARATION" &&
                    myMemberData.role === 'HOST' &&
                    <ActionButton onClick={() => setShowStartModal(true)}>토론 시작하기</ActionButton>
                }
                {
                    currentRoundInfo.type === "PRESENTATION" &&
                    <ActionButton
                        disabled={currentSpeaker?.accountId !== myMemberData.id}
                        onClick={handleEndPresentation}
                    >
                        발표 끝내기
                    </ActionButton>
                }

                <StartDebateModal
                    open={showStartModal}
                    onClose={() => setShowStartModal(false)}
                    onConfirm={handleStartDebate}
                    isLoading={createRoundMutation.isPending}
                />
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

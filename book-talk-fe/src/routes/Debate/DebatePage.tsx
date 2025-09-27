import {Suspense, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {useParams} from 'react-router-dom';
import {useQueryClient} from "@tanstack/react-query";
import {Stack} from '@mui/material';
import MainContainer from '../../components/MainContainer/MainContainer';
import {DebateHeader} from './_components/DebateHeader';
import {DebatePresentation} from './_components/DebatePresentation';
import {DebateMemberList} from './_components/DebateMemberList';
import {RoundStartBackdrop} from './_components/RoundStartBackdrop';
import {ActionButton, DebateContainer} from './Debate.style';
import {useDebate} from "../../hooks/useDebate.tsx";
import {useDebateWebSocket} from "../../hooks/useDebateWebSocket.tsx";
import {useDebateRoundSpeaker} from "../../hooks/useDebateRoundSpeaker";
import StartDebateModal from "./_components/StartDebateModal.tsx";
import {VoiceChatProvider} from "../../contexts/VoiceChatContext";
import {useVoiceChat} from "../../hooks/useVoiceChat";
import type {WebSocketMessage} from "../../apis/websocket";
import micOffSvg from "../../assets/mic-off.svg";
import micOnSvg from "../../assets/mic-on.svg";
import {findOneDebateQueryOptions} from "../../apis/debate";
import type {DebateRoundInfo} from "../../apis/websocket/client.ts";

interface Props {
    debateId: string | undefined;
}

function MicrophoneControl() {
    const {isJoined, isMuted, toggleMute, joinVoiceChat, isConnecting} = useVoiceChat();

    const handleClick = async () => {
        try {
            if (!isJoined) {
                await joinVoiceChat();
            } else {
                toggleMute();
            }
        } catch (error) {
            // 마이크 권한이 거부된 경우
            if (error instanceof Error) {
                if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
                    alert('마이크 권한이 필요합니다. 브라우저 설정에서 마이크 권한을 허용해주세요.');
                } else {
                    console.error('Failed to join voice chat:', error);
                    alert('음성 채팅 연결에 실패했습니다.');
                }
            }
        }
    };


    const getMicIcon = () => {
        if (!isJoined) {
            // 미참여 상태: 회색 마이크 오프
            return <img src={micOffSvg} alt="음성 채팅 참여" width={14} height={19}/>;
        } else if (isMuted) {
            // 참여 중 + 음소거: 회색 마이크 오프
            return <img src={micOffSvg} alt="마이크 켜기" width={14} height={19}/>;
        } else {
            // 참여 중 + 마이크 켜짐: 흰색 마이크 온
            return <img src={micOnSvg} alt="마이크 끄기" width={14} height={19}
                        style={{filter: 'brightness(0) invert(1)'}}/>;
        }
    };

    return (
        <ActionButton
            onClick={handleClick}
            disabled={isConnecting}
            title={!isJoined ? "음성 채팅 참여" : (isMuted ? "마이크 켜기" : "마이크 끄기")}
            borderColor={'#FF8E66'}
            backgroundColor={"#FFFFFF"}
        >
            {getMicIcon()}
        </ActionButton>
    );
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
    const [showRound1StartBackdrop, setShowRound1StartBackdrop] = useState(false);
    const [showRound2StartBackdrop, setShowRound2StartBackdrop] = useState(false);

    // WebSocket을 통해 발표자 업데이트를 받았을 때 쿼리 무효화
    const handleSpeakerUpdate = useCallback((speakerInfo: unknown) => {
        console.log('Speaker updated via WebSocket:', speakerInfo);
        // 토론 데이터를 다시 가져오도록 쿼리 무효화
        if (debateId) {
            void queryClient.invalidateQueries({queryKey: findOneDebateQueryOptions().queryKey});
        }
    }, [queryClient, debateId]);

    // WebSocket을 통해 토론 라운드 업데이트를 받았을 때 쿼리 무효화
    const handleDebateRoundUpdate = useCallback((roundInfo: DebateRoundInfo) => {
        console.log('Debate round updated via WebSocket:', roundInfo);

        if (roundInfo.round.type === "PRESENTATION") {
            setShowRound1StartBackdrop(true);

            setTimeout(() => {
                setShowRound1StartBackdrop(false);
            }, 5000);
        } else if (roundInfo.round.type === "FREE") {
            setShowRound2StartBackdrop(true);

            setTimeout(() => {
                setShowRound2StartBackdrop(false);
            }, 5000);
        }

        // 토론 데이터를 다시 가져오도록 쿼리 무효화
        if (debateId) {
            void queryClient.invalidateQueries({queryKey: findOneDebateQueryOptions().queryKey});
        }
    }, [queryClient, debateId]);

    // Voice chat signaling handler reference
    const voiceSignalingHandlerRef = useRef<((message: WebSocketMessage) => void) | null>(null);
    const wsClientRef = useRef<{
        isConnected: () => boolean;
        sendVoiceMessage: (message: WebSocketMessage) => void
    } | null>(null);

    const handleVoiceSignaling = useCallback((message: WebSocketMessage) => {
        console.log('Voice signaling message received:', message);
        if (voiceSignalingHandlerRef.current) {
            voiceSignalingHandlerRef.current(message);
        }
    }, []);

    const handlers = useMemo(() => ({
        onSpeakerUpdate: handleSpeakerUpdate,
        onDebateRoundUpdate: handleDebateRoundUpdate,
        onVoiceSignaling: handleVoiceSignaling
    }), [handleSpeakerUpdate, handleDebateRoundUpdate, handleVoiceSignaling]);

    const {isAccountOnline, wsClient} = useDebateWebSocket(debateId || null, handlers);

    // Store wsClient reference for use in voice chat
    useEffect(() => {
        wsClientRef.current = wsClient;
    }, [wsClient]);

    // Voice chat WebSocket message sender
    const sendVoiceMessage = useCallback((message: WebSocketMessage) => {
        if (wsClientRef.current?.isConnected()) {
            wsClientRef.current.sendVoiceMessage(message);
        }
    }, []);

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
                    // PRESENTATION 라운드가 끝났을 때 FREE 라운드 생성
                    try {
                        await createRoundMutation.mutateAsync({
                            debateId,
                            nextSpeakerId: debate.members.find(m => m.role === "HOST")?.id || ""
                        });
                        console.log('Successfully created FREE round');
                        await queryClient.invalidateQueries({queryKey: findOneDebateQueryOptions().queryKey});
                        return;
                    } catch (error) {
                        console.error('Failed to create FREE round:', error);
                        await queryClient.invalidateQueries({queryKey: findOneDebateQueryOptions().queryKey});
                        return;
                    }
                }
            } else {
                // 다른 타입일 때: nextSpeakerId 사용
                nextSpeakerId = currentRoundInfo.nextSpeakerId || null;
                if (!nextSpeakerId) {
                    console.log('No next speaker specified');
                    await queryClient.invalidateQueries({queryKey: findOneDebateQueryOptions().queryKey});
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
            void queryClient.invalidateQueries({queryKey: findOneDebateQueryOptions().queryKey});
        }
    }, [debateId, currentSpeaker, currentRoundInfo, debate.members, createRoundSpeakerMutation, createRoundMutation, queryClient]);

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
            <VoiceChatProvider
                debateId={debateId!}
                myAccountId={myMemberData.id!}
                onSignalingMessage={sendVoiceMessage}
                participantsList={debate.members.map(member => ({
                    id: member.id,
                    name: member.name
                }))}
                voiceSignalingHandlerRef={voiceSignalingHandlerRef}
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
                    />
                    <Stack spacing={2}>
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
                        {
                            currentRoundInfo.type !== "PREPARATION" &&
                            <MicrophoneControl/>
                        }
                    </Stack>

                    <StartDebateModal
                        open={showStartModal}
                        onClose={() => setShowStartModal(false)}
                        onConfirm={handleStartDebate}
                        isLoading={createRoundMutation.isPending}
                    />

                    <RoundStartBackdrop
                        open={showRound1StartBackdrop}
                        onClose={() => setShowRound1StartBackdrop(false)}
                    >
                        <RoundStartBackdrop.Title>1 라운드 시작</RoundStartBackdrop.Title>
                        <RoundStartBackdrop.Subtitle>발표지를 활용해 자신의 생각이나 의견을 말해주세요!</RoundStartBackdrop.Subtitle>
                        <RoundStartBackdrop.Description>
                            우측 프로필의 순서대로 발표가 진행됩니다.<br/>시간 내 발표가 끝나면 발표끝내기 버튼을 눌러 다음사람에게 넘겨주세요.
                        </RoundStartBackdrop.Description>
                    </RoundStartBackdrop>

                    <RoundStartBackdrop
                        open={showRound2StartBackdrop}
                        onClose={() => setShowRound2StartBackdrop(false)}
                    >
                        <RoundStartBackdrop.Title>2 라운드 시작</RoundStartBackdrop.Title>
                        <RoundStartBackdrop.Subtitle>다양한 자료를 공유하며 자유롭게 토론해주세요!</RoundStartBackdrop.Subtitle>
                        <RoundStartBackdrop.Description>
                            프로필 메뉴기능을 통해 다른 사람의 발표지를 확인하거나 발언권을 넘겨줄 수 있어요.<br/>손들기 버튼으로 발언권을 주장하고 발표자를 넘겨받으세요.
                        </RoundStartBackdrop.Description>
                    </RoundStartBackdrop>
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

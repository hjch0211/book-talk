import {Suspense, useCallback, useEffect, useRef, useState} from 'react';
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
import {useVoiceChat, VoiceChatProvider} from "../../contexts/VoiceChatContext";
import {VoiceAudioRenderer} from "./_components/VoiceAudioRenderer.tsx";
import {useSuspenseQuery} from "@tanstack/react-query";
import {findOneDebateQueryOptions} from "../../apis/debate";
import {meQueryOption} from "../../apis/account";

type RoundType = 'PREPARATION' | 'PRESENTATION' | 'FREE';

interface Props {
    debateId: string | undefined;
}

interface DebatePageInnerProps {
    debateId: string | undefined;
    sendSignalingRef: React.MutableRefObject<((message: any) => void) | null>;
    onWebSocketConnected: (connected: boolean) => void;
    onDebateJoined: (joined: boolean) => void;
    onOnlineAccountsChange: (accountIds: Set<string>) => void;
}

function DebatePageInner({debateId, sendSignalingRef, onWebSocketConnected, onDebateJoined, onOnlineAccountsChange}: DebatePageInnerProps) {
    const [showStartModal, setShowStartModal] = useState(false);
    const {handleSignalingMessage} = useVoiceChat();

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
        websocket: {toggleHand, isHandRaised, raisedHands, sendVoiceMessage, sendChatMessage, membersWithPresence, isConnected, isDebateJoined},
        chat,
        showRoundStartBackdrop,
        closeRoundStartBackdrop,
        voiceChatHandlerRef
    } = useDebate({
        debateId
    });

    // VoiceChat 핸들러 연결
    useEffect(() => {
        voiceChatHandlerRef.current = handleSignalingMessage;
    }, [handleSignalingMessage, voiceChatHandlerRef]);

    // WebSocket 전송 함수 연결
    useEffect(() => {
        if (sendSignalingRef) {
            sendSignalingRef.current = sendVoiceMessage;
        }
    }, [sendVoiceMessage, sendSignalingRef]);

    // WebSocket 연결 상태 전달
    useEffect(() => {
        onWebSocketConnected(isConnected);
    }, [isConnected, onWebSocketConnected]);

    // Debate join 상태 전달
    useEffect(() => {
        onDebateJoined(isDebateJoined);
    }, [isDebateJoined, onDebateJoined]);

    // 온라인 계정 상태 전달
    useEffect(() => {
        const onlineIds = new Set(
            membersWithPresence.map(m => m.id)
        );
        onOnlineAccountsChange(onlineIds);
    }, [membersWithPresence, onOnlineAccountsChange]);

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
    );
}

function DebatePageContent({debateId}: Props) {
    const {data: debate} = useSuspenseQuery(findOneDebateQueryOptions(debateId));
    const {data: me} = useSuspenseQuery(meQueryOption);

    // WebSocket 전송 함수를 담을 ref
    const sendSignalingRef = useRef<((message: any) => void) | null>(null);

    // WebSocket 연결 상태
    const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);
    const [isDebateJoined, setIsDebateJoined] = useState(false);
    const [onlineAccountIds, setOnlineAccountIds] = useState<Set<string>>(new Set());

    // 상대방 ID 결정 (1:1만 지원)
    const remotePeerId = debate.members.find(m => m.id !== me?.id)?.id || null;

    // 상대방이 온라인인지 확인
    const isRemotePeerOnline = remotePeerId ? onlineAccountIds.has(remotePeerId) : false;

    // useCallback으로 메모이제이션하여 불필요한 리렌더링 방지
    const handleSendSignaling = useCallback((message: any) => {
        console.log('📤 Sending signaling message:', message);
        if (sendSignalingRef.current) {
            sendSignalingRef.current(message);
        } else {
            console.warn('⚠️ sendSignalingRef not initialized yet');
        }
    }, []);

    return (
        <MainContainer isAuthPage>
            <VoiceChatProvider
                debateId={debateId!}
                myAccountId={me?.id || ''}
                remotePeerId={remotePeerId}
                isWebSocketConnected={isWebSocketConnected}
                isDebateJoined={isDebateJoined}
                isRemotePeerOnline={isRemotePeerOnline}
                onSendSignaling={handleSendSignaling}
            >
                <DebatePageInner
                    debateId={debateId}
                    sendSignalingRef={sendSignalingRef}
                    onWebSocketConnected={setIsWebSocketConnected}
                    onDebateJoined={setIsDebateJoined}
                    onOnlineAccountsChange={setOnlineAccountIds}
                />
                <VoiceAudioRenderer/>
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

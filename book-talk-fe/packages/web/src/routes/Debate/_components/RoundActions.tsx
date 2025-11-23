import {ActionButton} from '../Debate.style';
import raiseHandSvg from "../../../assets/raise-hand.svg";

type RoundType = 'PREPARATION' | 'PRESENTATION' | 'FREE';

interface RoundActionsProps {
    roundType: RoundType;
    myRole: string;
    isCurrentSpeaker: boolean;
    onStartDebate: () => void;
    onEndPresentation: () => void;
    onToggleHand: () => void;
    isMyHandRaised: boolean;
}

/** 라운드별 Action button */
export function RoundActions({
                                 roundType,
                                 myRole,
                                 isCurrentSpeaker,
                                 onStartDebate,
                                 onEndPresentation,
                                 onToggleHand,
                                 isMyHandRaised
                             }: RoundActionsProps) {
    return (
        <>
            {roundType === "PREPARATION" && myRole === 'HOST' && (
                <ActionButton onClick={onStartDebate}>토론 시작하기</ActionButton>
            )}
            {roundType === "PRESENTATION" && (
                <ActionButton
                    disabled={!isCurrentSpeaker}
                    onClick={onEndPresentation}
                >
                    발표 끝내기
                </ActionButton>
            )}
            {
                roundType === "FREE" && (
                    <ActionButton
                        onClick={onToggleHand}
                        style={{
                            backgroundColor: isMyHandRaised ? '#1976d2' : undefined,
                            color: isMyHandRaised ? 'black' : undefined
                        }}
                    >
                        <img
                            src={raiseHandSvg}
                            alt={isMyHandRaised ? "손내리기" : "손들기"}
                            width={16.5}
                            height={24}
                            style={{
                                filter: isMyHandRaised ? 'black' : undefined
                            }}
                        />
                    </ActionButton>
                )
            }
        </>
    );
}

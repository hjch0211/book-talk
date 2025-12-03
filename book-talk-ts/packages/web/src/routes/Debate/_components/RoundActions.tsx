import { Stack } from '@mui/material';
import raiseHandSvg from '../../../assets/raise-hand.svg';
import { ActionButton } from '../Debate.style';
import { MicrophoneControlButton } from './MicrophoneControlButton.tsx';

type RoundType = 'PREPARATION' | 'PRESENTATION' | 'FREE';

interface RoundActionsProps {
  /** 현재 라운드 타입 */
  roundType: RoundType;
  /** 내 멤버 역할(host, member) */
  myRole: string;
  /** 현재 발언자 여부 */
  isCurrentSpeaker: boolean;
  /** 토론 시작 핸들러 */
  onStartDebate: () => void;
  /** 발표 종료 핸들러 */
  onEndPresentation: () => void;
  /** 손들기 토글 핸들러 */
  onToggleHand: () => void;
  /** 내 손들기 상태 */
  isMyHandRaised: boolean;
  /** 음성 채팅 참여 여부 */
  isVoiceChatJoined: boolean;
  /** 음소거 상태 */
  isVoiceMuted: boolean;
  /** 음소거 토글 핸들러 */
  onToggleMute: () => void;
}

/** 라운드별 Action button */
export function RoundActions({
  roundType,
  myRole,
  isCurrentSpeaker,
  onStartDebate,
  onEndPresentation,
  onToggleHand,
  isMyHandRaised,
  isVoiceChatJoined,
  isVoiceMuted,
  onToggleMute,
}: RoundActionsProps) {
  return (
    <Stack spacing={2}>
      {roundType === 'PREPARATION' && myRole === 'HOST' && (
        <ActionButton onClick={onStartDebate}>토론 시작하기</ActionButton>
      )}
      {roundType === 'PRESENTATION' && (
        <ActionButton disabled={!isCurrentSpeaker} onClick={onEndPresentation}>
          발표 끝내기
        </ActionButton>
      )}
      {roundType !== 'PREPARATION' && (
        <MicrophoneControlButton
          isActive={isVoiceChatJoined}
          isMuted={isVoiceMuted}
          onToggleMute={onToggleMute}
        />
      )}
      {roundType === 'FREE' && (
        <ActionButton
          onClick={onToggleHand}
          style={{
            backgroundColor: isMyHandRaised ? '#1976d2' : undefined,
            color: isMyHandRaised ? 'black' : undefined,
          }}
        >
          <img
            src={raiseHandSvg}
            alt={isMyHandRaised ? '손내리기' : '손들기'}
            width={16.5}
            height={24}
            style={{
              filter: isMyHandRaised ? 'black' : undefined,
            }}
          />
        </ActionButton>
      )}
    </Stack>
  );
}

import { Group } from '@mui/icons-material';
import micOffSvg from '@src/assets/mic-off.svg';
import micOnSvg from '@src/assets/mic-on.svg';
import raiseHandSvg from '@src/assets/raise-hand.svg';
import type { RoundType } from '@src/externals/debate';
import {
  MobileBottomButtons,
  MobileBottomButtonWrapper,
  MobileIconButton,
  MobileTextButton,
} from '../style.ts';

interface Props {
  roundType: RoundType;
  myRole: string;
  isCurrentSpeaker: boolean;
  onStartDebate: () => void;
  onEndPresentation: () => void;
  isVoiceChatJoined: boolean;
  isVoiceMuted: boolean;
  onToggleMute: () => void;
  isMyHandRaised: boolean;
  onToggleHand: () => void;
  isExpanded: boolean;
  onToggleExpanded: () => void;
}

export function MobileDebateCTASection({
  roundType,
  myRole,
  isCurrentSpeaker,
  onStartDebate,
  onEndPresentation,
  isVoiceChatJoined,
  isVoiceMuted,
  onToggleMute,
  isMyHandRaised,
  onToggleHand,
  isExpanded,
  onToggleExpanded,
}: Props) {
  const isMicOff = !isVoiceChatJoined || isVoiceMuted;

  return (
    <MobileBottomButtonWrapper>
      <MobileBottomButtons>
        {roundType === 'PREPARATION' && myRole === 'HOST' && (
          <MobileTextButton $variant="styled-outlined" onClick={onStartDebate}>
            토론시작
          </MobileTextButton>
        )}
        {roundType === 'PRESENTATION' && (
          <MobileTextButton disabled={!isCurrentSpeaker} onClick={onEndPresentation}>
            발표 끝내기
          </MobileTextButton>
        )}
        <MobileIconButton
          onClick={onToggleMute}
          disabled={!isVoiceChatJoined}
          title={!isVoiceChatJoined ? '음성 채팅 연결 중...' : isMicOff ? '음소거 해제' : '음소거'}
        >
          <img
            src={isMicOff ? micOffSvg : micOnSvg}
            alt={isMicOff ? '마이크 끄기' : '마이크 켜기'}
            width={24}
            height={24}
          />
        </MobileIconButton>
        <MobileIconButton
          $active={isMyHandRaised}
          onClick={onToggleHand}
          title={isMyHandRaised ? '손내리기' : '손들기'}
        >
          <img
            src={raiseHandSvg}
            alt={isMyHandRaised ? '손내리기' : '손들기'}
            width={24}
            height={24}
          />
        </MobileIconButton>
        <MobileIconButton $active={isExpanded} onClick={onToggleExpanded} title="참여자 목록">
          <Group sx={{ width: 24, height: 24, color: isExpanded ? '#5F84FF' : '#7B7B7B' }} />
        </MobileIconButton>
      </MobileBottomButtons>
    </MobileBottomButtonWrapper>
  );
}

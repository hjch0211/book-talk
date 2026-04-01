import { Box, Stack, Typography } from '@mui/material';
import { AppButton } from '@src/components/molecules/AppButton';
import type { RoundType } from '@src/hooks';
import raiseHandSvg from '../../../assets/raise-hand.svg';
import { MicrophoneControlButton } from './MicrophoneControlButton.tsx';

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
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch',
        gap: '48px',
        width: '200px',
      }}
    >
      {/* 상단 액션 버튼 그룹 */}
      <Stack spacing="12px">
        {roundType === 'PREPARATION' && myRole === 'HOST' && (
          <AppButton appVariant="styled-outlined" onClick={onStartDebate}>
            <Typography variant="title3" color="inherit">
              토론시작
            </Typography>
          </AppButton>
        )}
        {roundType !== 'FREE' && (
          <AppButton
            fullWidth
            appVariant="rounded"
            disabled={!isCurrentSpeaker}
            onClick={onEndPresentation}
          >
            <Typography variant="title3" color="inherit">
              발표 끝내기
            </Typography>
          </AppButton>
        )}
      </Stack>
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: '8px', width: '200px' }}>
        <MicrophoneControlButton
          isActive={isVoiceChatJoined}
          isMuted={isVoiceMuted}
          onToggleMute={onToggleMute}
        />
        <AppButton
          appVariant="rounded"
          sx={{
            ...(isMyHandRaised && { background: '#E8EBFF', borderColor: '#5F84FF' }),
          }}
          onClick={onToggleHand}
        >
          <img
            src={raiseHandSvg}
            alt={isMyHandRaised ? '손내리기' : '손들기'}
            width={16.5}
            height={24}
          />
        </AppButton>
      </Box>
      ;
    </Box>
  );
}

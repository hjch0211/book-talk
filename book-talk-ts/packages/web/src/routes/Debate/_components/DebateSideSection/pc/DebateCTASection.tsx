import { Box, Stack, Typography } from '@mui/material';
import micOffSvg from '@src/assets/mic-off.svg';
import micOnSvg from '@src/assets/mic-on.svg';
import raiseHandSvg from '@src/assets/raise-hand.svg';
import { AppButton } from '@src/components/molecules/AppButton';
import type { RoundType } from '@src/hooks';

interface DebateCTASectionProps {
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
export function DebateCTASection({
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
}: DebateCTASectionProps) {
  const isMicOff = !isVoiceChatJoined || isVoiceMuted;
  const micTitle = !isVoiceChatJoined
    ? '음성 채팅 연결 중...'
    : isMicOff
      ? '음소거 해제'
      : '음소거';

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

      {/* 음성/손들기 컨트롤 */}
      <Box sx={{ display: 'flex', flexDirection: 'row', gap: '8px', width: '200px' }}>
        <AppButton
          appVariant="rounded"
          fullWidth
          onClick={onToggleMute}
          title={micTitle}
          disabled={!isVoiceChatJoined}
          sx={{
            height: '60px',
            borderRadius: '50px',
            background: '#FFFFFF',
            border: '1px solid #8E99FF',
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
          }}
        >
          <img
            src={isMicOff ? micOffSvg : micOnSvg}
            alt={isMicOff ? '마이크 끄기' : '마이크 켜기'}
            width={14}
            height={19}
          />
        </AppButton>
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
    </Box>
  );
}

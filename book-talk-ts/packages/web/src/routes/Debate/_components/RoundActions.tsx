import { Box, Stack, Tooltip, Typography } from '@mui/material';
import { AppButton } from '@src/components/molecules/AppButton';
import type { RoundType } from '@src/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useEffectEvent, useRef, useState } from 'react';
import raiseHandSvg from '../../../assets/raise-hand.svg';
import { MicrophoneControlButton } from './MicrophoneControlButton.tsx';

const KST_OFFSET = 9 * 60 * 60 * 1000;
const toKst = (isoString: string) => new Date(new Date(isoString).getTime() + KST_OFFSET);
const formatTime = (isoString: string): string => {
  const d = toKst(isoString);
  const h = d.getUTCHours();
  const m = d.getUTCMinutes();
  return m === 0 ? `${h}시` : `${h}시 ${m}분`;
};

interface RoundActionsProps {
  /** 현재 라운드 타입 */
  roundType: RoundType;
  /** 내 멤버 역할(host, member) */
  myRole: string;
  /** 현재 발언자 여부 */
  isCurrentSpeaker: boolean;
  /** 토론 시작 핸들러 */
  onStartDebate: () => void;
  /** 토론 예정 시작 시간 (ISO string) */
  startAt: string;
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
  startAt,
}: RoundActionsProps) {
  const queryClient = useQueryClient();
  const [now, setNow] = useState(() => new Date());
  const invalidatedRef = useRef(false);

  const handleInvalidateQueries = useEffectEvent(() => {
    void queryClient.invalidateQueries();
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const current = new Date();
      setNow(current);
      if (!invalidatedRef.current && current >= new Date(startAt)) {
        invalidatedRef.current = true;
        handleInvalidateQueries();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [startAt]);

  const isStarted = now >= new Date(startAt);

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
          <Tooltip
            title={!isStarted && startAt ? `${formatTime(startAt)}부터 시작 가능합니다` : ''}
            arrow
          >
            <span>
              <AppButton appVariant="styled-outlined" disabled={!isStarted} onClick={onStartDebate}>
                <Typography variant="title3" color="inherit">
                  토론시작
                </Typography>
              </AppButton>
            </span>
          </Tooltip>
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

import { Typography, useMediaQuery, useTheme } from '@mui/material';
import { AppButton } from '@src/components/molecules/AppButton';
import {
  ButtonRow,
  ButtonSection,
  Caption,
} from '@src/routes/Home/_components/DebateDetailModal/style';

type MyRole = 'HOST' | 'MEMBER' | undefined;

const CAPTIONS: Record<'HOST' | 'MEMBER', string> = {
  HOST: '내가 생성한 토론방입니다.',
  MEMBER: '참여신청하신 토론방입니다.',
};

interface Props {
  myRole: MyRole;
  isFull: boolean;
  onJoin: () => void;
  onCancel: () => void;
  onEnter: () => void;
  onEdit: () => void;
  isJoinPending: boolean;
  isCancelPending: boolean;
}

export function DebateActionButtons({
  myRole,
  isFull,
  onJoin,
  onCancel,
  onEnter,
  onEdit,
  isJoinPending,
  isCancelPending,
}: Props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const btnHeight = isMobile ? 48 : 60;
  const filledWidth = isMobile ? '100%' : 250;
  const transparentWidth = isMobile ? '100%' : undefined;

  if (isFull) return;
  if (myRole === 'MEMBER') {
    return (
      <ButtonRow>
        <AppButton
          appVariant="transparent"
          sx={{ width: transparentWidth ?? 200 }}
          onClick={onCancel}
          loading={isCancelPending}
        >
          <Typography variant="labelM" color="inherit">
            참여신청 취소하기
          </Typography>
        </AppButton>
        <ButtonSection>
          <AppButton
            appVariant="filled"
            sx={{ width: filledWidth, height: btnHeight }}
            onClick={onEnter}
          >
            <Typography variant="labelM" color="inherit">
              토론방 입장하기
            </Typography>
          </AppButton>
          <Caption variant="captionS">{CAPTIONS.MEMBER}</Caption>
        </ButtonSection>
      </ButtonRow>
    );
  }

  if (myRole === 'HOST') {
    return (
      <ButtonRow>
        <AppButton
          appVariant="transparent"
          sx={{ width: transparentWidth ?? 162, height: btnHeight }}
          onClick={onEdit}
        >
          <Typography variant="labelM" color="inherit">
            토론정보 수정하기
          </Typography>
        </AppButton>
        <ButtonSection>
          <AppButton
            appVariant="filled"
            sx={{ width: filledWidth, height: btnHeight }}
            onClick={onEnter}
          >
            <Typography variant="labelM" color="inherit">
              토론방 입장하기
            </Typography>
          </AppButton>
          <Caption variant="captionS">{CAPTIONS.HOST}</Caption>
        </ButtonSection>
      </ButtonRow>
    );
  }

  return (
    <AppButton
      appVariant="filled"
      onClick={onJoin}
      loading={isJoinPending}
      sx={{ width: filledWidth, height: btnHeight }}
    >
      <Typography variant="labelM" color="inherit">
        참여 신청하기
      </Typography>
    </AppButton>
  );
}

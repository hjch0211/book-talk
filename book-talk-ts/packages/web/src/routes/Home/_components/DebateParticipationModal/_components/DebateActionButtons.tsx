import { Typography } from '@mui/material';
import { AppButton } from '@src/components/molecules/AppButton';
import {
  ButtonRow,
  ButtonSection,
  Caption,
} from '@src/routes/Home/_components/DebateParticipationModal/style';

type MyRole = 'HOST' | 'MEMBER' | undefined;

const CAPTIONS: Record<'HOST' | 'MEMBER' | 'FULL', string> = {
  HOST: '내가 생성한 토론방입니다.',
  MEMBER: '참여신청하신 토론방입니다.',
  FULL: '인원모집이 마감되었습니다.',
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
  if (isFull) {
    return (
      <ButtonSection>
        <AppButton
          appVariant="debate-closed"
          fullWidth={false}
          style={{ width: 250 }}
          disableRipple
        >
          <Typography variant="labelM" color="inherit">참여신청 마감</Typography>
        </AppButton>
        <Caption variant="captionS">{CAPTIONS.FULL}</Caption>
      </ButtonSection>
    );
  }

  if (myRole === 'MEMBER') {
    return (
      <ButtonRow>
        <AppButton
          appVariant="transparent"
          style={{ width: 200 }}
          onClick={onCancel}
          loading={isCancelPending}
        >
          <Typography variant="labelM" color="inherit">참여신청 취소하기</Typography>
        </AppButton>
        <ButtonSection>
          <AppButton appVariant="filled" style={{ width: 250, height: 60 }} onClick={onEnter}>
            <Typography variant="labelM" color="inherit">토론방 입장하기</Typography>
          </AppButton>
          <Caption variant="captionS">{CAPTIONS.MEMBER}</Caption>
        </ButtonSection>
      </ButtonRow>
    );
  }

  if (myRole === 'HOST') {
    return (
      <ButtonRow>
        <AppButton appVariant="transparent" style={{ width: 162, height: 60 }} onClick={onEdit}>
          <Typography variant="labelM" color="inherit">토론정보 수정하기</Typography>
        </AppButton>
        <ButtonSection>
          <AppButton appVariant="filled" style={{ width: 250, height: 60 }} onClick={onEnter}>
            <Typography variant="labelM" color="inherit">토론방 입장하기</Typography>
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
      style={{ width: 250, height: 60 }}
    >
      <Typography variant="labelM" color="inherit">참여 신청하기</Typography>
    </AppButton>
  );
}

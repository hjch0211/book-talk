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
  isJoinPending: boolean;
  isCancelPending: boolean;
}

export function DebateActionButtons({
  myRole,
  isFull,
  onJoin,
  onCancel,
  onEnter,
  isJoinPending,
  isCancelPending,
}: Props) {
  if (isFull) {
    return (
      <ButtonSection>
        <AppButton appVariant="debate-closed" sx={{ width: 250 }} disableRipple>
          참여신청 마감
        </AppButton>
        <Caption>{CAPTIONS.FULL}</Caption>
      </ButtonSection>
    );
  }

  if (myRole === 'MEMBER') {
    return (
      <ButtonRow>
        <AppButton
          appVariant="debate-cancel"
          sx={{ width: 200 }}
          onClick={onCancel}
          loading={isCancelPending}
        >
          참여신청 취소하기
        </AppButton>
        <ButtonSection>
          <AppButton appVariant="filled" sx={{ width: 250, height: 60 }} onClick={onEnter}>
            토론방 입장하기
          </AppButton>
          <Caption>{CAPTIONS.MEMBER}</Caption>
        </ButtonSection>
      </ButtonRow>
    );
  }

  if (myRole === 'HOST') {
    return (
      <ButtonSection>
        <AppButton appVariant="filled" sx={{ width: 250, height: 60 }} onClick={onEnter}>
          토론방 입장하기
        </AppButton>
        <Caption>{CAPTIONS.HOST}</Caption>
      </ButtonSection>
    );
  }

  return (
    <AppButton
      appVariant="filled"
      onClick={onJoin}
      loading={isJoinPending}
      sx={{ width: 250, height: 60 }}
    >
      참여 신청하기
    </AppButton>
  );
}
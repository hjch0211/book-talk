import { AppButton } from '@src/components/molecules/AppButton';
import Modal from '@src/components/organisms/Modal';
import {
  ButtonsRow,
  ModalContainer,
  ModalTitle,
} from '@src/routes/MyPage/_components/DeleteAccountModal/style.ts';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
}

export function DebateDeletionModal({ open, onClose, onConfirm, isPending }: Props) {
  return (
    <Modal open={open} onClose={onClose} width={470} inner>
      <ModalContainer>
        <ModalTitle>토론방을 삭제할까요?</ModalTitle>
        <ButtonsRow>
          <AppButton
            appVariant="transparent"
            fullWidth={false}
            type="button"
            style={{ width: 180, height: 60, borderRadius: 10 }}
            onClick={onClose}
          >
            아니요
          </AppButton>
          <AppButton
            appVariant="filled"
            fullWidth={false}
            type="button"
            style={{ width: 180, height: 60, borderRadius: 10 }}
            loading={isPending}
            onClick={onConfirm}
          >
            네
          </AppButton>
        </ButtonsRow>
      </ModalContainer>
    </Modal>
  );
}

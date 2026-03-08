import { AppButton } from '@src/components/molecules/AppButton';
import Modal from '@src/components/organisms/Modal';
import { ButtonsRow, ModalContainer, ModalTitle } from './style.ts';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
}

export function DeleteAccountModal({ open, onClose, onConfirm, isPending }: Props) {
  return (
    <Modal open={open} onClose={onClose} width={470} inner>
      <ModalContainer>
        <ModalTitle>회원탈퇴를 진행하시겠어요?</ModalTitle>
        <ButtonsRow>
          <AppButton
            appVariant="transparent"
            fullWidth={false}
            type="button"
            style={{ width: 180, height: 60, borderRadius: 10 }}
            disabled={isPending}
            onClick={onConfirm}
          >
            네
          </AppButton>
          <AppButton
            appVariant="filled"
            fullWidth={false}
            type="button"
            style={{ width: 180, height: 60, borderRadius: 10 }}
            onClick={onClose}
          >
            아니오
          </AppButton>
        </ButtonsRow>
      </ModalContainer>
    </Modal>
  );
}

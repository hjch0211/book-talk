import { CircularProgress } from '@mui/material';
import { useState } from 'react';
import Modal from '../../../../components/organisms/Modal';
import {
  ButtonText,
  ConfirmButton,
  ContentWrapper,
  InputWrapper,
  LoadingMessage,
  ModalContainer,
  ModalTitle,
  StyledTextField,
} from './NicknameModal.style';

interface NicknameModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (nickname: string) => void;
  isLoading?: boolean;
  loadingMessage?: string;
}

const NicknameModal = ({
  open,
  onClose,
  onSubmit,
  isLoading = false,
  loadingMessage,
}: NicknameModalProps) => {
  const [nickname, setNickname] = useState('');

  const handleSubmit = () => {
    if (nickname.trim()) {
      onSubmit(nickname);
    }
  };

  const handleClose = () => {
    setNickname('');
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} width={808} height={548} showCloseButton={true}>
      <ModalContainer>
        <ContentWrapper>
          <ModalTitle>토론방에서 사용할 닉네임을 입력해주세요</ModalTitle>

          <InputWrapper>
            <StyledTextField
              fullWidth
              variant="outlined"
              placeholder="최대 5글자"
              inputProps={{ maxLength: 5 }}
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isLoading) {
                  handleSubmit();
                }
              }}
              disabled={isLoading}
            />
            {isLoading && loadingMessage && <LoadingMessage>{loadingMessage}</LoadingMessage>}
          </InputWrapper>
        </ContentWrapper>

        <ConfirmButton onClick={handleSubmit} disabled={!nickname.trim() || isLoading}>
          {isLoading ? (
            <CircularProgress size={24} sx={{ color: '#262626' }} />
          ) : (
            <ButtonText isDisabled={!nickname.trim()}>확인</ButtonText>
          )}
        </ConfirmButton>
      </ModalContainer>
    </Modal>
  );
};

export default NicknameModal;

import CloseIcon from '@mui/icons-material/Close';
import type { ReactNode } from 'react';
import { CloseButton, ModalBox, StyledModal } from './style.ts';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  width?: number;
  height?: number;
  children: ReactNode;
  showCloseButton?: boolean;
}

const Modal = ({ open, onClose, width, height, children, showCloseButton = true }: ModalProps) => {
  return (
    <StyledModal open={open} onClose={onClose}>
      <ModalBox width={width} height={height}>
        {showCloseButton && (
          <CloseButton onClick={onClose}>
            <CloseIcon />
          </CloseButton>
        )}
        {children}
      </ModalBox>
    </StyledModal>
  );
};

export default Modal;

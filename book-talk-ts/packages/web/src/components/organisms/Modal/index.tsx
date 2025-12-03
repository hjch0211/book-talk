import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton, Modal as MuiModal } from '@mui/material';
import type { ReactNode } from 'react';
import { closeButtonStyle, getBoxStyle, modalStyle } from './style.ts';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  width?: number;
  height?: number;
  children: ReactNode;
  showCloseButton?: boolean;
}

const Modal = ({
  open,
  onClose,
  width = 808,
  height = 548,
  children,
  showCloseButton = true,
}: ModalProps) => {
  return (
    <MuiModal open={open} onClose={onClose} sx={modalStyle}>
      <Box sx={getBoxStyle(width, height)}>
        {showCloseButton && (
          <IconButton onClick={onClose} sx={closeButtonStyle}>
            <CloseIcon />
          </IconButton>
        )}
        {children}
      </Box>
    </MuiModal>
  );
};

export default Modal;

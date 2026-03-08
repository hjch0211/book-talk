import { Box, IconButton, Modal } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledModal = styled(Modal, {
  shouldForwardProp: (prop) => prop !== 'inner',
})<{ inner?: boolean }>(({ inner }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: inner ? 1400 : 1300,
}));

export const ModalBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'width' && prop !== 'height',
})<{ width?: number; height?: number }>(({ width, height }) => ({
  position: 'relative',
  width: width ?? 'fit-content',
  height: height ?? 'fit-content',
  boxShadow: '0px 2px 50px rgba(0, 0, 0, 0.1)',
  borderRadius: '24px',
  outline: 'none',
  border: '1px solid transparent',
  background:
    'linear-gradient(#FFFFFF, #FFFFFF) padding-box, linear-gradient(180deg, #AACDFF 0%, #5F84FF 100%) border-box',
}));

export const CloseButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'inner',
})<{ inner?: boolean }>(({ inner }) => ({
  position: 'absolute',
  width: 24,
  height: 24,
  right: inner ? 8 : 45,
  top: inner ? 16 : 45,
  color: 'rgba(0, 0, 0, 0.56)',
  padding: 0,
}));

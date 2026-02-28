import { Box, IconButton, Modal } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledModal = styled(Modal)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

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

export const CloseButton = styled(IconButton)({
  position: 'absolute',
  width: 24,
  height: 24,
  right: 45,
  top: 45,
  color: 'rgba(0, 0, 0, 0.56)',
  padding: 0,
});

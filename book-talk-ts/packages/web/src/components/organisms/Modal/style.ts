import { Box, IconButton, Modal } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledModal = styled(Modal, {
  shouldForwardProp: (prop) => prop !== 'inner',
})<{ inner?: boolean }>(({ theme, inner }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  justifyContent: 'center',
  paddingTop: '120px',
  zIndex: inner ? 1400 : 1300,
  [theme.breakpoints.down('md')]: {
    paddingTop: '60px',
    alignItems: 'flex-start',
  },
}));

export const ModalBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'width' && prop !== 'height',
})<{ width?: number; height?: number }>(({ theme, width, height }) => ({
  position: 'relative',
  width: width ?? 'fit-content',
  maxWidth: '94vw',
  height: height ?? 'fit-content',
  maxHeight: 'calc(100dvh - 160px)',
  overflowY: 'auto',
  boxShadow: '0px 2px 50px rgba(0, 0, 0, 0.1)',
  borderRadius: '24px',
  outline: 'none',
  border: '1px solid transparent',
  background:
    'linear-gradient(#FFFFFF, #FFFFFF) padding-box, linear-gradient(180deg, #AACDFF 0%, #5F84FF 100%) border-box',
  [theme.breakpoints.down('md')]: {
    width: '94vw',
    maxHeight: 'calc(100dvh - 80px)',
    borderRadius: '16px',
  },
}));

export const CloseButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'inner',
})<{ inner?: boolean }>(({ theme, inner }) => ({
  position: 'absolute',
  width: 24,
  height: 24,
  right: inner ? 8 : 45,
  top: inner ? 16 : 45,
  color: 'rgba(0, 0, 0, 0.56)',
  padding: 0,
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));

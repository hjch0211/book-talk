import type { SxProps, Theme } from '@mui/material';

export const modalStyle: SxProps<Theme> = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

export const getBoxStyle = (width: number, height: number): SxProps<Theme> => ({
  position: 'relative',
  width,
  height,
  bgcolor: '#FFFFFF',
  boxShadow: '0px 2px 50px rgba(0, 0, 0, 0.1)',
  borderRadius: '24px',
  outline: 'none',
});

export const closeButtonStyle: SxProps<Theme> = {
  position: 'absolute',
  width: 24,
  height: 24,
  right: 45,
  top: 45,
  color: 'rgba(0, 0, 0, 0.56)',
  p: 0,
};

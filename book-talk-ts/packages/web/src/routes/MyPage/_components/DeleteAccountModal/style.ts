import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const ModalContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '60px 40px 40px 40px',
  gap: 36,
  width: '100%',
});

export const ModalTitle = styled(Typography)({
  fontFamily: 'S-Core Dream',
  fontWeight: 500,
  fontSize: 16,
  lineHeight: '24px',
  textAlign: 'center',
  letterSpacing: '1px',
  color: '#262626',
});

export const ButtonsRow = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 10,
  width: '100%',
});

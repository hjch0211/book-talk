import styled from '@emotion/styled';
import { Box, Typography } from '@mui/material';

export const ModalContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '60px 60px 50px',
  gap: 40,
  width: '100%',
});

export const ContentGroup = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  alignItems: 'flex-end',
  gap: 48,
  width: 354,
});

export const FieldGroup = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: 18,
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
  width: '100%',
});

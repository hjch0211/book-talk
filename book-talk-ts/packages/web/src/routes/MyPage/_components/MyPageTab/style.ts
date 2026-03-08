import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const TabSection = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '24px',
  width: 1200,
  background: '#FFFFFF',
});

export const TabNavWrapper = styled(Box)({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '16px',
  isolation: 'isolate',
  width: 1200,
});

export const TabNav = styled(Box)({
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: '50px',
  width: 1200,
  height: 48,
  borderBottom: '1px solid #C4C4C4',
});

export const TabItem = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active: boolean }>(({ active: _ }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '0px',
  gap: '12px',
  height: 48,
  flex: 1,
  cursor: 'pointer',
  background: '#FFFFFF',
}));

export const TabItemText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active: boolean }>(({ active }) => ({
  fontFamily: 'S-Core Dream',
  fontWeight: 500,
  fontSize: 16,
  lineHeight: '24px',
  letterSpacing: '1px',
  color: active ? '#262626' : '#B6B6B6',
}));

export const TabIndicator = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'indicatorLeft',
})<{ indicatorLeft: number }>(({ indicatorLeft }) => ({
  position: 'absolute',
  height: 4,
  width: 240,
  background: '#8E99FF',
  bottom: 0,
  left: indicatorLeft,
  borderRadius: 2,
  zIndex: 1,
  transition: 'left 0.2s ease',
}));

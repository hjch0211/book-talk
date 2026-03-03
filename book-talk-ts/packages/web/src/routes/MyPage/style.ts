import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const BackNavRow = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: '70px 120px 42px',
  gap: '10px',
  width: '100%',
});

export const BackNavContent = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '10px',
  width: 1200,
  height: 24,
  cursor: 'pointer',
  margin: '0 auto',
});

export const BackNavText = styled(Typography)({
  fontFamily: 'S-Core Dream',
  fontWeight: 500,
  fontSize: 16,
  lineHeight: '24px',
  letterSpacing: '1px',
  color: '#000000',
});

export const ContentWrapper = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '0px 120px 120px',
  gap: '40px',
  width: '100%',
});

export const InnerWrapper = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '24px',
  width: 1200,
});

export const PageTitle = styled(Typography)({
  fontFamily: 'S-Core Dream',
  fontWeight: 500,
  fontSize: 24,
  lineHeight: '125%',
  letterSpacing: '0.3px',
  color: '#000000',
  width: '100%',
});

export const ChipGroup = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'start',
  gap: '10px',
  width: '100%',
});

export const FilterChipBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active: boolean }>(({ active }) => ({
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '10px 24px',
  height: 51,
  background: active ? '#F7F8FF' : '#FFFFFF',
  border: active ? 'none' : '1px solid #E8EBFF',
  borderRadius: 50,
  cursor: 'pointer',
  userSelect: 'none',
}));

export const FilterChipText = styled(Typography, {
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active: boolean }>(({ active }) => ({
  fontFamily: 'S-Core Dream',
  fontWeight: 200,
  fontSize: 16,
  lineHeight: '180%',
  letterSpacing: '0.3px',
  color: active ? '#262626' : '#7B7B7B',
}));

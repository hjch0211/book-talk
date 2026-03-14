import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const BackNavRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: '70px 120px 42px',
  gap: '10px',
  width: '100%',
  [theme.breakpoints.down('md')]: {
    padding: '40px 24px 24px',
  },
}));

export const ContentWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '0px 120px 120px',
  gap: '40px',
  width: '100%',
  [theme.breakpoints.down('md')]: {
    padding: '0 24px 60px',
  },
}));

export const InnerWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '24px',
  width: 1200,
  [theme.breakpoints.down('md')]: {
    width: '100%',
  },
}));

export const PageTitle = styled(Typography)({
  fontFamily: 'S-Core Dream',
  fontWeight: 500,
  fontSize: 24,
  lineHeight: '125%',
  letterSpacing: '0.3px',
  color: '#000000',
  width: '100%',
});

export const ChipGroup = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'start',
  gap: '10px',
  width: '100%',
  [theme.breakpoints.down('sm')]: {
    flexWrap: 'wrap',
  },
}));

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

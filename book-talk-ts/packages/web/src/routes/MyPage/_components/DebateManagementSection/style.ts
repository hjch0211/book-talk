import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const DebateSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '30px',
  width: 1200,
  [theme.breakpoints.down('md')]: {
    width: '100%',
  },
}));

export const SectionTitle = styled(Typography)({
  fontFamily: 'S-Core Dream',
  fontWeight: 500,
  fontSize: 18,
  lineHeight: '150%',
  letterSpacing: '1px',
  color: '#000000',
  width: '100%',
});

export const EmptyText = styled(Typography)({
  fontFamily: 'S-Core Dream',
  fontWeight: 200,
  fontSize: 16,
  lineHeight: '150%',
  letterSpacing: '0.3px',
  color: '#B6B6B6',
});

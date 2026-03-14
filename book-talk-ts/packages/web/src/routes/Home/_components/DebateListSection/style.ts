import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const DebateListSectionRoot = styled(Box)({
  width: '100%',
  maxWidth: 1196,
  display: 'flex',
  flexDirection: 'column',
  gap: '80px',
});

export const CardGrid = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: '48px',
  minHeight: '830px',
  [theme.breakpoints.down('md')]: {
    gap: '24px',
    minHeight: 'unset',
    alignItems: 'center',
  },
}));

export const CardRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: '24px',
  [theme.breakpoints.down('md')]: {
    flexWrap: 'wrap',
    gap: '16px',
    justifyContent: 'center',
  },
}));

export const PaginationWrapper = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
});

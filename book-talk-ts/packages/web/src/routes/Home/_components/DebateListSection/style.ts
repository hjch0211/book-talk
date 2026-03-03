import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const DebateListSectionRoot = styled(Box)({
  width: '100%',
  maxWidth: 1196,
  display: 'flex',
  flexDirection: 'column',
  gap: '80px',
});

export const CardGrid = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '48px',
  minHeight: '830px',
});

export const CardRow = styled(Box)({
  display: 'flex',
  gap: '24px',
});

export const PaginationWrapper = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
});

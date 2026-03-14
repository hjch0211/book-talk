import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const ContentWrapper = styled(Box)(({ theme }) => ({
  width: '100%',
  padding: '70px 120px 80px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '70px',
  [theme.breakpoints.down('md')]: {
    padding: '40px 24px 60px',
    gap: '40px',
  },
}));

export const SearchRow = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'flex-start',
  padding: '0 0 0 423px',
  gap: '234px',
  width: 1187,
  height: 48,
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    padding: '0',
    gap: '12px',
    width: '100%',
    height: 'auto',
    alignItems: 'center',
  },
}));

export const CreateButtonWrapper = styled(Box)(({ theme }) => ({
  width: 180,
  [theme.breakpoints.down('md')]: {
    width: '350px',
  },
}));

export const SearchResultLabel = styled(Typography)({
  fontFamily: "'S-Core Dream', sans-serif",
  fontStyle: 'normal',
  fontWeight: 500,
  fontSize: 18,
  lineHeight: '150%',
  letterSpacing: '1px',
  color: '#262626',
  alignSelf: 'stretch',
});

/** 검색 결과 1-4개일 때 두 섹션 가로 래퍼 */
export const TwoSectionWrapper = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '140px',
  width: '100%',
});

/** 각 섹션(제목 + 카드 행) 래퍼 */
export const DebateSectionWrapper = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '40px',
});

export const EmptyStateWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '30px',
  width: 557,
  [theme.breakpoints.down('md')]: {
    width: '100%',
  },
}));

export const EmptyStateText = styled(Typography)({
  fontFamily: "'S-Core Dream', sans-serif",
  fontStyle: 'normal',
  fontWeight: 200,
  fontSize: 18,
  lineHeight: '180%',
  textAlign: 'center',
  letterSpacing: '0.3px',
  color: '#000000',
  alignSelf: 'stretch',
});

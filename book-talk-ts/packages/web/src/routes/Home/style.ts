import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

/** 헤더 아래 전체 콘텐츠 영역 */
export const ContentWrapper = styled(Box)({
  width: '100%',
  padding: '70px 120px 80px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '70px',
});

/** 검색창 + 생성 버튼 가로 행 */
export const SearchRow = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'flex-start',
  padding: '0 0 0 423px',
  gap: '234px',
  width: 1187,
  height: 48,
});

/** "토론방 생성하기" 버튼 너비 고정 래퍼 */
export const CreateButtonWrapper = styled(Box)({
  width: 180,
});

/** 검색 결과 안내 텍스트 */
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

import styled from '@emotion/styled';
import { Box, Typography } from '@mui/material';

export const WithdrawalContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  alignItems: 'flex-end',
  gap: 60,
  width: 982,
});

export const HeaderGroup = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: 10,
  width: '100%',
});

export const WithdrawalTitle = styled(Typography)({
  fontFamily: 'S-Core Dream',
  fontWeight: 500,
  fontSize: 24,
  lineHeight: '125%',
  letterSpacing: '0.3px',
  color: '#262626',
});

export const WithdrawalSubtitle = styled(Typography)({
  fontFamily: 'S-Core Dream',
  fontWeight: 500,
  fontSize: 14,
  lineHeight: '20px',
  letterSpacing: '0.3px',
  color: '#555555',
});

export const NoticeBox = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: '70px 40px',
  gap: 60,
  width: '100%',
  background: '#F8F8F8',
  borderRadius: 18,
  boxSizing: 'border-box',
});

export const NoticeSection = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: 18,
});

export const NoticeSectionTitle = styled(Typography)({
  fontFamily: 'S-Core Dream',
  fontWeight: 500,
  fontSize: 18,
  lineHeight: '150%',
  letterSpacing: '1px',
  color: '#000000',
});

export const NoticeList = styled('ul')({
  margin: 0,
  paddingLeft: 20,
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
});

export const NoticeListItem = styled('li')({
  fontFamily: 'S-Core Dream',
  fontWeight: 200,
  fontSize: 16,
  lineHeight: '180%',
  letterSpacing: '0.3px',
  color: '#000000',
});

export const CheckboxRow = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  padding: 0,
});

export const CheckboxLabel = styled(Typography)({
  fontFamily: 'S-Core Dream',
  fontWeight: 500,
  fontSize: 14,
  lineHeight: '20px',
  letterSpacing: '0.3px',
  color: '#000000',
});

export const ButtonRow = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 18,
});

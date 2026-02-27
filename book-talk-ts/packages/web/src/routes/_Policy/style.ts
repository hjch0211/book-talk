import { Box, Divider, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const PolicyWrapper = styled(Box)({
  maxWidth: 800,
  width: '100%',
  margin: '0 auto',
  padding: '48px 32px 80px',
});

export const PolicyTitle = styled(Typography)({
  fontWeight: 700,
  fontSize: 28,
  color: '#1a1a1a',
  marginBottom: 8,
});

export const PolicyDate = styled(Typography)({
  fontWeight: 300,
  fontSize: 14,
  color: '#7B7B7B',
  marginBottom: 32,
});

export const PolicyDivider = styled(Divider)({
  marginBottom: 32,
});

export const SectionWrapper = styled(Box)({
  marginBottom: 36,
});

export const SectionTitle = styled(Typography)({
  fontFamily: 'S-Core Dream',
  fontWeight: 600,
  fontSize: 18,
  color: '#1a1a1a',
  marginBottom: 12,
});

export const ChapterTitle = styled(Typography)({
  fontFamily: 'S-Core Dream',
  fontWeight: 700,
  fontSize: 20,
  color: '#1a1a1a',
  marginTop: 16,
  marginBottom: 8,
});

export const SubSectionTitle = styled(Typography)({
  fontFamily: 'S-Core Dream',
  fontWeight: 500,
  fontSize: 15,
  color: '#2a2a2a',
  marginTop: 16,
  marginBottom: 8,
});

export const BodyText = styled(Typography)({
  fontFamily: 'S-Core Dream',
  fontWeight: 300,
  fontSize: 15,
  color: '#434343',
  lineHeight: 1.9,
  marginBottom: 8,
});

export const BulletItem = styled(Box)({
  fontWeight: 300,
  fontSize: 15,
  color: '#434343',
  lineHeight: 1.9,
}) as typeof Box;

export const BulletList = styled(Box)({
  paddingLeft: 24,
  margin: 0,
}) as typeof Box;

export const OrderedList = styled(Box)({
  paddingLeft: 24,
  margin: 0,
}) as typeof Box;

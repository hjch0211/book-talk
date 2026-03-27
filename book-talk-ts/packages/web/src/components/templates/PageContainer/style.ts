import { Box, Container } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'bgColor',
})<{ bgColor?: string }>(({ bgColor }) => ({
  width: '100%',
  minHeight: '100vh',
  background: bgColor || 'transparent',
  overflowX: 'hidden',
}));

export const StyledContainer = styled(Container)(() => ({
  width: '100%',
  maxWidth: '1440px !important',
  height: '100%',
  minHeight: '100vh',
  margin: '0 auto',
  padding: 0,
  background: 'transparent',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

import { Box, Container } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledFixedWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'bgColor',
})<{ bgColor?: string }>(({ bgColor }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: bgColor || 'transparent',
  overflow: 'auto',
}));

export const StyledRelativeWrapper = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'bgColor',
})<{ bgColor?: string }>(({ bgColor }) => ({
  position: 'relative',
  width: '100%',
  background: bgColor || 'transparent',
  overflowX: 'clip',
}));

export const StyledContainer = styled(Container)(() => ({
  position: 'relative',
  width: '100%',
  maxWidth: '1440px !important',
  minHeight: '100vh',
  margin: '0 auto',
  padding: 0,
  background: 'transparent',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

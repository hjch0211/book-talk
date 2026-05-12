import { keyframes } from '@emotion/react';
import { Box } from '@mui/material';
import { styled as muiStyled } from '@mui/material/styles';

// ---------------------------------------------------------------------------
// Keyframes
// ---------------------------------------------------------------------------

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
`;

export const AiChatContainer = muiStyled(Box)({
  position: 'relative',
  zIndex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
  minHeight: '100vh',
  height: '100%',
  padding: '120px',
});

export const StepContainer = muiStyled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  animation: ${fadeInUp} 0.45s ease both;
`;

// ---------------------------------------------------------------------------
// Debate step
// ---------------------------------------------------------------------------

export const StepTitle = muiStyled('h2')({
  fontFamily: "'Gaegu', sans-serif",
  fontWeight: 500,
  fontSize: 32,
  color: '#262626',
  marginBottom: 32,
  textAlign: 'center',
  margin: '0 0 32px',
});

export const DebateCarousel = muiStyled(Box)({
  display: 'flex',
  overflowX: 'auto',
  scrollSnapType: 'x mandatory',
  gap: 4,
  width: '100%',
  height: 480,
  paddingBottom: 12,
  marginBottom: 24,
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
  '&::-webkit-scrollbar': { display: 'none' },
});

export const DebateCardWrapper = muiStyled(Box)({
  flex: '0 0 calc(50% - 8px)',
  scrollSnapAlign: 'start',
  cursor: 'pointer',
  width: 'fit-content',
  transition: 'border-color 0.2s',
  '@media (max-width: 600px)': {
    flex: '0 0 calc(82% - 8px)',
  },
});

export const LoadingWrapper = muiStyled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  minHeight: 200,
  marginBottom: 24,
});

export const NameInputWrapper = muiStyled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 12,
  width: '100%',
  maxWidth: 420,
  marginBottom: 32,
});

export const NameStepTitle = muiStyled('h2')({
  fontFamily: "'MemomentKkukkukk', sans-serif",
  fontWeight: 400,
  fontSize: 30,
  lineHeight: '24px',
  color: '#262626',
  textAlign: 'center',
  letterSpacing: '1px',
  margin: '0 0 120px',
});

export const NameContentCard = muiStyled(Box)(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '60px 120px',
  gap: 31,
  width: '100%',
  maxWidth: 660,
  background: 'rgba(255, 255, 255, 0.8)',
  borderRadius: 64,
  marginBottom: 24,
  boxSizing: 'border-box',
  [theme.breakpoints.down('sm')]: {
    padding: '40px 24px',
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: '-8px',
    borderRadius: 72,
    border: '8px solid #E8EBFF',
    filter: 'url(#crayon-border)',
    pointerEvents: 'none',
  },
}));

export const NameInputBody = muiStyled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: 60,
  width: '100%',
  maxWidth: 420,
});

export const NameInput = muiStyled('input')({
  width: '100%',
  height: 52,
  padding: '0 12px',
  fontSize: 14,
  fontFamily: "'S-Core Dream', sans-serif",
  fontWeight: 200,
  color: '#262626',
  background: '#FFFFFF',
  border: '1px solid #D9D9D9',
  borderRadius: 18,
  outline: 'none',
  boxSizing: 'border-box',
  letterSpacing: '0.3px',
  '&::placeholder': {
    color: '#7B7B7B',
  },
  '&:focus': {
    border: '1px solid rgba(139, 124, 248, 0.6)',
  },
});

export const PrivacyNotice = muiStyled('p')({
  fontFamily: "'S-Core Dream', sans-serif",
  fontWeight: 300,
  fontSize: 12,
  lineHeight: '18px',
  letterSpacing: '0.3px',
  color: '#808080',
  textAlign: 'center',
  margin: '16px 0 0',
});

export const ButtonRow = muiStyled(Box)({
  position: 'absolute',
  bottom: 60,
  left: '50%',
  transform: 'translateX(-50%)',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: 12,
  width: '100%',
  maxWidth: 600,
});

// ---------------------------------------------------------------------------
// Debate step
// ---------------------------------------------------------------------------

export const DebateStepWrapper = muiStyled(Box)({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100%',
});

export const DebateHintText = muiStyled('button')({
  fontFamily: "'S-Core Dream', sans-serif",
  fontWeight: 200,
  fontSize: 12,
  lineHeight: '16px',
  letterSpacing: '0.3px',
  color: '#B6B6B6',
  textDecoration: 'underline',
  textAlign: 'center',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: 0,
  marginTop: 24,
  '&:hover': { color: '#9090A0' },
});

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

export const AiChatContainer = muiStyled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%',
  minHeight: '100vh',
  padding: '60px 24px 80px',
  [theme.breakpoints.down('sm')]: {
    padding: '40px 16px 60px',
  },
}));

export const StepContainer = muiStyled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
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
  height: '100%',
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

export const NameInput = muiStyled('input')({
  width: '100%',
  padding: '14px 20px',
  fontSize: 16,
  fontFamily: "'S-Core Dream', sans-serif",
  fontWeight: 400,
  color: '#262626',
  background: 'rgba(255, 255, 255, 0.2)',
  border: '1px solid rgba(255, 255, 255, 0.3)',
  borderRadius: 16,
  backdropFilter: 'blur(5px)',
  WebkitBackdropFilter: 'blur(5px)',
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
  outline: 'none',
  boxSizing: 'border-box',
  '&::placeholder': {
    color: '#aaa',
  },
  '&:focus': {
    border: '1px solid rgba(139, 124, 248, 0.6)',
  },
});

export const NavigationRow = muiStyled(Box)({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  gap: 12,
  marginTop: 16,
  width: '100%',
  maxWidth: 420,
});

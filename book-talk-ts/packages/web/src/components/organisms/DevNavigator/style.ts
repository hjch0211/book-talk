import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const FloatingButton = styled('button')({
  position: 'fixed',
  bottom: '24px',
  right: '24px',
  zIndex: 9999,
  width: '44px',
  height: '44px',
  borderRadius: '50%',
  backgroundColor: '#8E99FF',
  color: '#fff',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '18px',
  fontWeight: 700,
  boxShadow: '0 4px 12px rgba(142, 153, 255, 0.5)',
  transition: 'background-color 0.2s',
  '&:hover': {
    backgroundColor: '#7B85E8',
  },
});

export const ModalOverlay = styled(Box)({
  position: 'fixed',
  inset: 0,
  zIndex: 10000,
  backgroundColor: 'rgba(0, 0, 0, 0.4)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const ModalPanel = styled(Box)({
  backgroundColor: '#fff',
  borderRadius: '12px',
  padding: '24px',
  width: '320px',
  maxHeight: '80vh',
  overflowY: 'auto',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.16)',
});

export const ModalTitle = styled(Typography)({
  fontFamily: "'S-Core Dream', sans-serif",
  fontWeight: 700,
  fontSize: '16px',
  color: '#262626',
  marginBottom: '16px',
});

export const NavList = styled('ul')({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
});

export const NavItem = styled('li')({});

export const NavButton = styled('button')({
  width: '100%',
  textAlign: 'left',
  background: 'none',
  border: 'none',
  borderRadius: '8px',
  padding: '10px 12px',
  cursor: 'pointer',
  fontFamily: "'S-Core Dream', sans-serif",
  fontWeight: 500,
  fontSize: '14px',
  color: '#434343',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  transition: 'background-color 0.15s',
  '&:hover': {
    backgroundColor: '#F0F1FF',
    color: '#8E99FF',
  },
});

export const NavPath = styled('span')({
  fontFamily: 'monospace',
  fontSize: '12px',
  color: '#aaa',
  marginLeft: 'auto',
});

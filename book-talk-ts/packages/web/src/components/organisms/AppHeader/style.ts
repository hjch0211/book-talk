import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const DevBadge = styled('span')({
  fontFamily: "'S-Core Dream', sans-serif",
  fontWeight: 500,
  fontSize: '11px',
  color: '#8E99FF',
  letterSpacing: '0.5px',
  userSelect: 'none',
});

export const LogoContainer = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '20px',
  height: '44px',
});

export const LogoLink = styled('div')({
  cursor: 'pointer',
});

export const NavMenuGroup = styled('nav')({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '24px',
});

export const NavMenuItemText = styled('button')({
  fontFamily: "'S-Core Dream', sans-serif",
  fontWeight: 500,
  fontSize: '16px',
  lineHeight: '24px',
  letterSpacing: '1px',
  color: '#262626',
  background: 'none',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  '&:hover': {
    color: '#8E99FF',
  },
});

export const HeaderAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.92)',
  backdropFilter: 'blur(8px)',
  borderBottom: 'none',
  height: 80,
  paddingLeft: '120px',
  paddingRight: '120px',
  [theme.breakpoints.down('md')]: {
    paddingLeft: '16px',
    paddingRight: '16px',
  },
}));

export const HeaderToolbar = styled(Toolbar)({
  height: '100%',
  justifyContent: 'space-between',
  padding: '0 !important',
});

export const DesktopNav = styled(Box)(({ theme }) => ({
  display: 'none',
  alignItems: 'center',
  gap: '24px',
  [theme.breakpoints.up('md')]: {
    display: 'flex',
  },
}));

export const HamburgerButton = styled(IconButton)(({ theme }) => ({
  display: 'flex',
  color: '#262626',
  [theme.breakpoints.up('md')]: {
    display: 'none',
  },
}));

export const DrawerContent = styled(Box)({
  width: 240,
  paddingTop: '16px',
});

export const DrawerProfileName = styled(Typography)({
  fontFamily: "'S-Core Dream', sans-serif",
  fontWeight: 200,
  fontSize: 14,
  letterSpacing: 0.3,
  color: '#434343',
});

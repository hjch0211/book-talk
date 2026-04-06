import { Logout, Menu as MenuIcon, Person } from '@mui/icons-material';
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Skeleton,
  Typography,
} from '@mui/material';
import signedProfileSvg from '@src/assets/header/signed-profile.svg';
import unsignedProfileSvg from '@src/assets/header/unsigned-profile.svg';
import { SuspenseErrorBoundary } from '@src/components/molecules/SuspenseErrorBoundary';
import { env } from '@src/configs/env';
import { meQueryOption } from '@src/externals/account';
import { signOut } from '@src/externals/auth';
import { clearTokens } from '@src/externals/client';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import type React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoSvg from '../../../assets/logo.svg';
import {
  DevBadge,
  DesktopNav,
  DrawerContent,
  DrawerProfileName,
  HamburgerButton,
  HeaderAppBar,
  HeaderToolbar,
  LogoContainer,
  LogoLink,
  NavMenuGroup,
  NavMenuItemText,
} from './style';

const navItemSx = {
  fontFamily: 'S-Core Dream',
  fontWeight: 500,
  fontSize: 16,
  letterSpacing: '1px',
  color: '#262626',
};

const profileItemSx = {
  fontFamily: 'S-Core Dream',
  fontWeight: 200,
  fontSize: 16,
  letterSpacing: 0.3,
  color: '#434343',
};

const ProfileSection = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { data: me } = useSuspenseQuery(meQueryOption);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const logoutMutation = useMutation({
    mutationFn: signOut,
    onSettled: () => {
      clearTokens();
      queryClient.clear();
      navigate('/');
    },
  });

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{ p: 0 }}
        aria-controls={open ? 'profile-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <img src={me ? signedProfileSvg : unsignedProfileSvg} width={36} height={36} alt="프로필" />
      </IconButton>

      <Menu
        id="profile-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            elevation: 3,
            sx: {
              width: 220,
              mt: 1.5,
              '& .MuiMenuItem-root': {
                fontFamily: 'S-Core Dream',
                fontWeight: 200,
                fontSize: 16,
                letterSpacing: 0.3,
                color: '#434343',
                py: 1.5,
                px: 2,
              },
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {me ? (
          [
            <Box key="name" sx={{ px: 2, py: 1 }}>
              <DrawerProfileName>{me.name}</DrawerProfileName>
            </Box>,
            <Divider key="divider" sx={{ my: 1 }} />,
            <MenuItem
              key="mypage"
              onClick={() => {
                handleClose();
                navigate('/my-page');
              }}
            >
              <ListItemIcon>
                <Person fontSize="small" sx={{ color: '#7B7B7B' }} />
              </ListItemIcon>
              <ListItemText>
                <Typography variant="body2">마이페이지</Typography>
              </ListItemText>
            </MenuItem>,
            <MenuItem key="logout" onClick={() => logoutMutation.mutate()}>
              <ListItemIcon>
                <Logout fontSize="small" sx={{ color: '#7B7B7B' }} />
              </ListItemIcon>
              <ListItemText>
                <Typography variant="body2">로그아웃</Typography>
              </ListItemText>
            </MenuItem>,
          ]
        ) : (
          <MenuItem onClick={() => navigate('/sign-in')}>
            <ListItemIcon>
              <Person fontSize="small" sx={{ color: '#7B7B7B' }} />
            </ListItemIcon>
            <ListItemText>
              <Typography variant="body2">로그인</Typography>
            </ListItemText>
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

const MobileDrawerContent = ({ onClose }: { onClose: () => void }) => {
  const navigate = useNavigate();
  const { data: me } = useSuspenseQuery(meQueryOption);
  const queryClient = useQueryClient();

  const logoutMutation = useMutation({
    mutationFn: signOut,
    onSettled: () => {
      clearTokens();
      queryClient.clear();
      navigate('/');
      onClose();
    },
  });

  const go = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <DrawerContent role="presentation">
      <List>
        <ListItemButton onClick={() => go('/home')}>
          <ListItemText primary="북톡 홈" slotProps={{ primary: { sx: navItemSx } }} />
        </ListItemButton>
        <ListItemButton onClick={() => go('/')}>
          <ListItemText primary="북톡 소개" slotProps={{ primary: { sx: navItemSx } }} />
        </ListItemButton>
      </List>
      <Divider />
      <List>
        {me ? (
          <>
            <Box sx={{ px: 2, py: 1 }}>
              <DrawerProfileName>{me.name}</DrawerProfileName>
            </Box>
            <ListItemButton onClick={() => go('/my-page')}>
              <ListItemIcon>
                <Person fontSize="small" sx={{ color: '#7B7B7B' }} />
              </ListItemIcon>
              <ListItemText primary="마이페이지" slotProps={{ primary: { sx: profileItemSx } }} />
            </ListItemButton>
            <ListItemButton onClick={() => logoutMutation.mutate()}>
              <ListItemIcon>
                <Logout fontSize="small" sx={{ color: '#7B7B7B' }} />
              </ListItemIcon>
              <ListItemText primary="로그아웃" slotProps={{ primary: { sx: profileItemSx } }} />
            </ListItemButton>
          </>
        ) : (
          <ListItemButton onClick={() => go('/sign-in')}>
            <ListItemIcon>
              <Person fontSize="small" sx={{ color: '#7B7B7B' }} />
            </ListItemIcon>
            <ListItemText primary="로그인" slotProps={{ primary: { sx: profileItemSx } }} />
          </ListItemButton>
        )}
      </List>
    </DrawerContent>
  );
};

const AppHeader = () => {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <HeaderAppBar position="sticky" elevation={0}>
      <HeaderToolbar>
        <LogoContainer>
          <LogoLink onClick={() => navigate('/home')}>
            <img src={logoSvg} alt="BookTalk Logo" width={182} height={44} />
          </LogoLink>
          {env.APP_ENV === 'development' && <DevBadge>(dev)</DevBadge>}
        </LogoContainer>

        {/* 데스크탑 네비게이션 */}
        <DesktopNav>
          <NavMenuGroup>
            <NavMenuItemText onClick={() => navigate('/home')}>북톡 홈</NavMenuItemText>
            <NavMenuItemText onClick={() => navigate('/')}>북톡 소개</NavMenuItemText>
          </NavMenuGroup>
          <SuspenseErrorBoundary
            onSuspense={<Skeleton animation="wave" variant="circular" width={36} height={36} />}
            onError={<img src={unsignedProfileSvg} width={36} height={36} alt="프로필" />}
          >
            <ProfileSection />
          </SuspenseErrorBoundary>
        </DesktopNav>

        {/* 모바일 햄버거 버튼 */}
        <HamburgerButton onClick={() => setDrawerOpen(true)} aria-label="메뉴 열기">
          <MenuIcon />
        </HamburgerButton>
      </HeaderToolbar>

      {/* 모바일 드로어 */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <SuspenseErrorBoundary
          onSuspense={
            <Box sx={{ width: 240, p: 2 }}>
              <Skeleton animation="wave" height={40} />
              <Skeleton animation="wave" height={40} />
            </Box>
          }
          onError={
            <Box sx={{ width: 240, p: 2 }}>
              <Typography variant="body2">오류가 발생했습니다.</Typography>
            </Box>
          }
        >
          <MobileDrawerContent onClose={() => setDrawerOpen(false)} />
        </SuspenseErrorBoundary>
      </Drawer>
    </HeaderAppBar>
  );
};

export default AppHeader;

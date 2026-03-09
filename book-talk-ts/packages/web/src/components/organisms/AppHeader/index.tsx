import { Logout, Person } from '@mui/icons-material';
import {
  AppBar,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Skeleton,
  Toolbar,
  Typography,
} from '@mui/material';
import signedProfileSvg from '@src/assets/header/signed-profile.svg';
import unsignedProfileSvg from '@src/assets/header/unsigned-profile.svg';
import { SuspenseErrorBoundary } from '@src/components';
import { meQueryOption } from '@src/externals/account';
import { signOut } from '@src/externals/auth';
import { clearTokens } from '@src/externals/client';
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query';
import type React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoSvg from '../../../assets/logo.svg';
import { LogoContainer, LogoLink, NavMenuGroup, NavMenuItemText } from './style';

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

  const handleLoginPageNavigate = () => {
    navigate('/sign-in');
  };

  const handleLogout = () => {
    logoutMutation.mutate();
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
                typography: 'body2',
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
              <Typography
                sx={{
                  fontFamily: 'S-Core Dream',
                  fontWeight: 200,
                  fontSize: 14,
                  letterSpacing: 0.3,
                  color: '#434343',
                }}
              >
                {me.name}
              </Typography>
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
                <Typography variant={'body2'}>마이페이지</Typography>
              </ListItemText>
            </MenuItem>,
            <MenuItem key="logout" onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" sx={{ color: '#7B7B7B' }} />
              </ListItemIcon>
              <ListItemText>
                <Typography variant={'body2'}>로그아웃 </Typography>
              </ListItemText>
            </MenuItem>,
          ]
        ) : (
          <MenuItem onClick={handleLoginPageNavigate}>
            <ListItemIcon>
              <Person fontSize="small" sx={{ color: '#7B7B7B' }} />
            </ListItemIcon>
            <ListItemText>
              <Typography variant={'body2'}>로그인</Typography>
            </ListItemText>
          </MenuItem>
        )}
      </Menu>
    </>
  );
};

const AppHeader = () => {
  const navigate = useNavigate();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'blur(8px)',
        borderBottom: 'none',
        height: 80,
        px: '120px',
      }}
    >
      <Toolbar sx={{ height: '100%', justifyContent: 'space-between', px: '0 !important' }}>
        <LogoContainer>
          <LogoLink onClick={() => navigate('/home')}>
            <img src={logoSvg} alt="BookTalk Logo" width={182} height={44} />
          </LogoLink>
        </LogoContainer>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
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
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader;

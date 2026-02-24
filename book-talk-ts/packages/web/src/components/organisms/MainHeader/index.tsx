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
import { meQueryOption } from '@src/externals/account';
import { signOut } from '@src/externals/auth';
import { clearTokens } from '@src/externals/client.ts';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { Suspense, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoSvg from '../../../assets/logo.svg';
import UpdateNicknameModal from '../../../routes/Main/_components/NickNameModal/UpdateNicknameModal.tsx';
import { LogoContainer, LogoWrapper, NavMenuGroup, NavMenuItemText } from './style.ts';

const ProfileSection = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const open = Boolean(anchorEl);
  const { data: me } = useSuspenseQuery(meQueryOption);
  const navigate = useNavigate();

  const logoutMutation = useMutation({
    mutationFn: signOut,
    onSettled: () => {
      clearTokens();
      window.location.reload();
    },
  });

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNicknameUpdateModalOpen = () => {
    setAnchorEl(null);
    setIsUpdateModalOpen(true);
  };

  const handleNicknameUpdateModalClose = () => {
    setIsUpdateModalOpen(false);
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
        PaperProps={{
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
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {me ? (
          <>
            <Box sx={{ px: 2, py: 1 }}>
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
            </Box>
            <Divider sx={{ my: 1 }} />
            <MenuItem onClick={handleNicknameUpdateModalOpen}>
              <ListItemIcon>
                <Person fontSize="small" sx={{ color: '#7B7B7B' }} />
              </ListItemIcon>
              <ListItemText>닉네임 변경하기</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" sx={{ color: '#7B7B7B' }} />
              </ListItemIcon>
              <ListItemText>로그아웃</ListItemText>
            </MenuItem>
          </>
        ) : (
          <MenuItem onClick={handleLoginPageNavigate}>
            <ListItemIcon>
              <Person fontSize="small" sx={{ color: '#7B7B7B' }} />
            </ListItemIcon>
            <ListItemText>로그인</ListItemText>
          </MenuItem>
        )}
      </Menu>

      <UpdateNicknameModal open={isUpdateModalOpen} onClose={handleNicknameUpdateModalClose} />
    </>
  );
};

const MainHeader = () => {
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
          <LogoWrapper>
            <img src={logoSvg} alt="BookTalk Logo" width={182} height={44} />
          </LogoWrapper>
        </LogoContainer>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <NavMenuGroup>
            <NavMenuItemText onClick={() => navigate('/home')}>북톡 홈</NavMenuItemText>
            <NavMenuItemText onClick={() => navigate('/')}>북톡 소개</NavMenuItemText>
          </NavMenuGroup>
          <Suspense
            fallback={<Skeleton animation="wave" variant="circular" width={36} height={36} />}
          >
            <ProfileSection />
          </Suspense>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default MainHeader;

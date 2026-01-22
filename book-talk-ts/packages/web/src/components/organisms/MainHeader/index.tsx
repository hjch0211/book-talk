import { Logout, Person } from '@mui/icons-material';
import {
  AppBar,
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material';
import { meQueryOption } from '@src/externals/account';
import { signOut } from '@src/externals/auth';
import { clearTokens } from '@src/externals/client.ts';
import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { Suspense, useState } from 'react';
import logoSvg from '../../../assets/logo.svg';
import UpdateNicknameModal from '../../../routes/Main/_components/NickNameModal/UpdateNicknameModal.tsx';
import { LogoContainer, LogoWrapper } from './style.ts';

const ProfileSection = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const open = Boolean(anchorEl);
  const { data: me } = useSuspenseQuery(meQueryOption);

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

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  if (!me) return null;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, marginLeft: 'auto' }}>
      <IconButton
        onClick={handleClick}
        size="small"
        sx={{ p: 0 }}
        aria-controls={open ? 'profile-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        <Avatar
          sx={{
            width: 40,
            height: 40,
            bgcolor: '#EADDFF',
            color: '#4F378A',
            cursor: 'pointer',
          }}
        />
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
      </Menu>

      <UpdateNicknameModal open={isUpdateModalOpen} onClose={handleNicknameUpdateModalClose} />
    </Box>
  );
};

const MainHeader = () => {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: '#FFFFFF',
        borderBottom: 'none',
        height: 84,
        px: '120px',
      }}
    >
      <Toolbar sx={{ height: '100%', gap: '374px' }}>
        <LogoContainer>
          <LogoWrapper>
            <img src={logoSvg} alt="BookTalk Logo" width={182} height={44} />
          </LogoWrapper>
        </LogoContainer>

        <Suspense fallback={<></>}>
          <ProfileSection />
        </Suspense>
      </Toolbar>
    </AppBar>
  );
};

export default MainHeader;

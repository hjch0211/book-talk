import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Modal from '@src/components/organisms/Modal';
import { useState } from 'react';

export function MobileUnsupportedModal() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [dismissed, setDismissed] = useState(false);

  return (
    <Modal open={isMobile && !dismissed} onClose={() => setDismissed(true)} inner>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          padding: '48px 40px',
          textAlign: 'center',
        }}
      >
        <Typography
          sx={{
            fontFamily: "'S-Core Dream', sans-serif",
            fontWeight: 600,
            fontSize: 18,
            lineHeight: '170%',
            letterSpacing: '0.3px',
            color: '#262626',
          }}
        >
          현재 모바일은 미지원합니다.
        </Typography>
        <Typography
          sx={{
            fontFamily: "'S-Core Dream', sans-serif",
            fontWeight: 400,
            fontSize: 15,
            lineHeight: '170%',
            letterSpacing: '0.3px',
            color: '#7B7B7B',
          }}
        >
          PC로 들어와주세요!
        </Typography>
      </Box>
    </Modal>
  );
}

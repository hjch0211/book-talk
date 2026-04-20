import { Box, Typography } from '@mui/material';
import { AppButton } from '@src/components/molecules/AppButton';
import Modal from '../../../../components/organisms/Modal';

interface Props {
  onConfirm: () => void;
  isLoading?: boolean;
  onClose: () => void;
  open: boolean;
}

function StartDebateModal({ onConfirm, isLoading = false, onClose, open }: Props) {
  return (
    <Modal open={open} onClose={onClose} inner hideBackdrop={false} width={470}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          padding: { xs: '28px 24px', md: '40px 60px 40px 40px' },
          gap: { xs: '24px', md: '40px' },
          boxSizing: 'border-box',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: { xs: '24px', md: '36px' },
            width: '100%',
          }}
        >
          <Typography
            sx={{
              fontFamily: 'S-Core Dream',
              fontWeight: 500,
              fontSize: { xs: '14px', md: '16px' },
              lineHeight: '24px',
              textAlign: 'center',
              letterSpacing: '1px',
              color: '#262626',
            }}
          >
            토론을 시작하시겠어요?
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '10px',
              width: '100%',
            }}
          >
            <AppButton
              appVariant="transparent"
              onClick={onClose}
              disabled={isLoading}
              fullWidth
            >
              <Typography variant="labelM" color="inherit">
                아니오
              </Typography>
            </AppButton>

            <AppButton
              appVariant="filled"
              onClick={onConfirm}
              disabled={isLoading}
              fullWidth
              sx={{
                background: '#F7F8FF',
                border: 'none',
                '&:hover': {
                  background: '#eef0ff',
                  border: 'none',
                },
              }}
            >
              <Typography variant="labelM" color="inherit">
                {isLoading ? '시작 중...' : '예'}
              </Typography>
            </AppButton>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}

export default StartDebateModal;

import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton, Rating, Typography } from '@mui/material';
import { AppButton } from '@src/components/molecules/AppButton';
import { urls } from '@src/constants/urls.ts';
import { useState } from 'react';
import Modal from '../../../../components/organisms/Modal';

interface Props {
  onConfirm: (rate: number) => void;
  isLoading?: boolean;
  onClose: () => void;
  open: boolean;
}

function SurveyModal({ onConfirm, isLoading = false, onClose, open }: Props) {
  const [rating, setRating] = useState<number>(0);

  const handleConfirm = () => {
    if (rating && rating > 0) {
      onConfirm(rating);
    }
  };

  return (
    <Modal open={open} onClose={onClose} showCloseButton={false}>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '86px 51px',
          gap: '75px',
          height: '100%',
          position: 'relative',
        }}
      >
        {/* Close Button */}
        <IconButton
          onClick={onClose}
          disabled={isLoading}
          sx={{
            position: 'absolute',
            width: '24px',
            height: '24px',
            top: '45px',
            right: '45px',
            padding: 0,
            color: 'rgba(0, 0, 0, 0.56)',
          }}
        >
          <CloseIcon />
        </IconButton>

        {/* Content */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '32px',
            width: '564px',
          }}
        >
          {/* Title */}
          <Typography
            sx={{
              width: '564px',
              height: '30px',
              fontFamily: 'S-Core Dream',
              fontWeight: 500,
              fontSize: '24px',
              lineHeight: '125%',
              textAlign: 'center',
              letterSpacing: '0.3px',
              color: '#000000',
            }}
          >
            북톡에 대한 리뷰를 남겨주세요!
          </Typography>

          {/* Rating */}
          <Rating
            name="survey-rating"
            value={rating / 2}
            onChange={(_, newValue) => {
              setRating((newValue ?? 0) * 2);
            }}
            precision={0.5}
            size="large"
          />
        </Box>

        {/* Buttons */}
        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: '30px' }}>
          <a href={urls.INQUIRY} target="_blank" rel="noopener noreferrer">
            <AppButton
              appVariant="outlined"
              fullWidth={false}
              disabled={isLoading}
              sx={{ height: 76 }}
            >
              문의 내용 남기기
            </AppButton>
          </a>

          <AppButton
            appVariant="filled"
            fullWidth={false}
            onClick={handleConfirm}
            disabled={isLoading || !rating}
            loading={isLoading}
            sx={{ width: 200, height: 76 }}
          >
            완료
          </AppButton>
        </Box>
      </Box>
    </Modal>
  );
}

export default SurveyModal;

import { useState } from 'react';
import { Box, Button, Typography, Rating, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
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
    <Modal open={open} onClose={onClose} width={666} height={406} showCloseButton={false}>
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
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-start',
            gap: '30px',
            width: '451px',
            height: '76px',
          }}
        >
          <Button
            disabled={isLoading}
            href="https://docs.google.com/forms/d/e/1FAIpQLSeJS7YMm1S1qAQbUZkn7fHmm1Xyo9zV6L3cDfekLYdQq-BlUg/viewform"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '8px 16px',
              height: '76px',
              background: '#FFFFFF',
              border: '1px solid #9D9D9D',
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
              borderRadius: '8px',
              lineHeight: '125%',
              letterSpacing: '0.3px',
              color: '#262626',
              '&:hover': {
                background: '#f5f5f5',
                border: '1px solid #9D9D9D',
              },
              '&:disabled': {
                opacity: 0.5,
              },
            }}
          >
              문의 내용 남기기
          </Button>

          <Button
            onClick={handleConfirm}
            disabled={isLoading || !rating || rating === 0}
            sx={{
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '8px 20px',
              width: '200px',
              height: '76px',
              background: '#D8DBFF',
              boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
              borderRadius: '8px',
              border: 'none',
              lineHeight: '125%',
              textAlign: 'center',
              letterSpacing: '0.3px',
              color: '#262626',
              '&:hover': {
                background: '#c5c9ff',
                border: 'none',
              },
              '&:disabled': {
                opacity: 0.5,
              },
            }}
          >
            {isLoading ? '제출 중...' : '완료'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default SurveyModal;
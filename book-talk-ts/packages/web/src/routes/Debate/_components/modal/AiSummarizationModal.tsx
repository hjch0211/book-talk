import CloseIcon from '@mui/icons-material/Close';
import { Box, IconButton, Modal as MuiModal, Skeleton, Typography } from '@mui/material';

interface Props {
  open: boolean;
  onClose: () => void;
  bookTitle?: string;
  topic?: string;
  bookImageUrl?: string;
  summarization?: string;
}

function AiSummarizationModal({
  open,
  onClose,
  bookTitle,
  topic,
  bookImageUrl,
  summarization,
}: Props) {
  const isLoading = !bookTitle || !topic || !bookImageUrl || !summarization;

  return (
    <MuiModal open={open} onClose={onClose} sx={{ zIndex: 999 }}>
      <Box
        sx={{
          position: 'absolute',
          width: { xs: '95%', md: '1250px' },
          height: { xs: '80dvh', md: '784px' },
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          background: '#FFFFFF',
          borderRadius: '24px',
          overflow: 'hidden',
        }}
      >
        {/* 상단바 */}
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: { xs: '60px', md: '104px' },
            left: '0px',
            top: '0px',
            background: 'linear-gradient(180deg, #FFFFFF 0%, rgba(255, 255, 255, 0.2) 100%)',
            zIndex: 10,
          }}
        >
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              width: '24px',
              height: '24px',
              right: { xs: '20px', md: '40px' },
              top: 'calc(50% - 12px)',
              color: '#7B7B7B',
              '&:hover': {
                color: '#262626',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        {/* contents */}
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: { xs: 'calc(100dvh - 60px)', md: '680px' },
            left: '0px',
            top: { xs: '60px', md: '104px' },
            overflowY: 'auto',
            '&::-webkit-scrollbar': {
              width: '8px',
            },
            '&::-webkit-scrollbar-thumb': {
              background: '#C4C4C4',
              borderRadius: '4px',
            },
            '&::-webkit-scrollbar-track': {
              background: 'transparent',
            },
          }}
        >
          {/* 컨텐츠 */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              padding: { xs: '0px 24px', md: '0px 80px' },
              gap: '32px',
            }}
          >
            {/* 제목과 책사진 */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '0px',
                gap: { xs: '24px', md: '40px' },
              }}
            >
              {/* 제목 영역 */}
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '0px',
                  gap: '18px',
                }}
              >
                {/* description - 책 제목 */}
                {isLoading ? (
                  <Skeleton
                    variant="text"
                    sx={{
                      width: { xs: '160px', md: '300px' },
                      height: { xs: '24px', md: '34px' },
                      borderRadius: '4px',
                    }}
                  />
                ) : (
                  <Typography
                    sx={{
                      fontFamily: 'S-Core Dream',
                      fontWeight: 500,
                      fontSize: { xs: '16px', md: '20px' },
                      lineHeight: '170%',
                      display: 'flex',
                      alignItems: 'center',
                      letterSpacing: '0.3px',
                      color: '#000000',
                    }}
                  >
                    {bookTitle}
                  </Typography>
                )}

                {/* topic - 토론 주제 */}
                {isLoading ? (
                  <Skeleton
                    variant="text"
                    sx={{
                      width: { xs: '100%', md: '600px' },
                      height: { xs: '32px', md: '42px' },
                      borderRadius: '4px',
                    }}
                  />
                ) : (
                  <Typography
                    sx={{
                      fontFamily: 'S-Core Dream',
                      fontWeight: 600,
                      fontSize: { xs: '20px', md: '28px' },
                      lineHeight: '150%',
                      display: 'flex',
                      alignItems: 'center',
                      letterSpacing: '0.3px',
                      color: '#000000',
                    }}
                  >
                    {topic}
                  </Typography>
                )}
              </Box>

              {/* img - 책 이미지 */}
              {isLoading ? (
                <Skeleton
                  variant="rectangular"
                  sx={{
                    width: { xs: '120px', md: '194px' },
                    height: { xs: '170px', md: '273px' },
                    borderRadius: '4px',
                  }}
                />
              ) : (
                <Box
                  component="img"
                  src={bookImageUrl}
                  alt={bookTitle}
                  sx={{
                    width: { xs: '120px', md: '194px' },
                    height: { xs: '170px', md: '273px' },
                    objectFit: 'cover',
                    borderRadius: '4px',
                  }}
                />
              )}
            </Box>

            {/* 본문 - summarization */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                paddingBottom: '80px',
                gap: '10px',
                width: { xs: '100%', md: '1090px' },
              }}
            >
              {isLoading ? (
                <>
                  <Skeleton
                    variant="text"
                    sx={{ width: '100%', height: { xs: '24px', md: '32px' }, borderRadius: '4px' }}
                  />
                  <Skeleton
                    variant="text"
                    sx={{ width: '100%', height: { xs: '24px', md: '32px' }, borderRadius: '4px' }}
                  />
                  <Skeleton
                    variant="text"
                    sx={{ width: '100%', height: { xs: '24px', md: '32px' }, borderRadius: '4px' }}
                  />
                  <Skeleton
                    variant="text"
                    sx={{ width: '100%', height: { xs: '24px', md: '32px' }, borderRadius: '4px' }}
                  />
                  <Skeleton
                    variant="text"
                    sx={{ width: '100%', height: { xs: '24px', md: '32px' }, borderRadius: '4px' }}
                  />
                  <Skeleton
                    variant="text"
                    sx={{ width: '100%', height: { xs: '24px', md: '32px' }, borderRadius: '4px' }}
                  />
                  <Skeleton
                    variant="text"
                    sx={{ width: '100%', height: { xs: '24px', md: '32px' }, borderRadius: '4px' }}
                  />
                  <Skeleton
                    variant="text"
                    sx={{ width: '80%', height: { xs: '24px', md: '32px' }, borderRadius: '4px' }}
                  />
                </>
              ) : (
                <Typography
                  sx={{
                    width: '100%',
                    fontFamily: 'S-Core Dream',
                    fontWeight: 200,
                    fontSize: { xs: '16px', md: '18px' },
                    lineHeight: '180%',
                    letterSpacing: '0.3px',
                    color: '#000000',
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {summarization}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    </MuiModal>
  );
}

export default AiSummarizationModal;

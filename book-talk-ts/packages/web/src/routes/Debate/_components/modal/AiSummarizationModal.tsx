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
    <MuiModal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          width: '1250px',
          height: '784px',
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
            height: '104px',
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
              right: '40px',
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
            height: '680px',
            left: '0px',
            top: '104px',
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
              padding: '0px 80px',
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
                gap: '40px',
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
                  <Skeleton variant="text" width={300} height={34} sx={{ borderRadius: '4px' }} />
                ) : (
                  <Typography
                    sx={{
                      fontFamily: 'S-Core Dream',
                      fontWeight: 500,
                      fontSize: '20px',
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
                  <Skeleton variant="text" width={600} height={42} sx={{ borderRadius: '4px' }} />
                ) : (
                  <Typography
                    sx={{
                      fontFamily: 'S-Core Dream',
                      fontWeight: 600,
                      fontSize: '28px',
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
                  width={194}
                  height={273}
                  sx={{ borderRadius: '4px' }}
                />
              ) : (
                <Box
                  component="img"
                  src={bookImageUrl}
                  alt={bookTitle}
                  sx={{
                    width: '194px',
                    height: '273px',
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
                width: '1090px',
              }}
            >
              {isLoading ? (
                <>
                  <Skeleton variant="text" width="100%" height={32} sx={{ borderRadius: '4px' }} />
                  <Skeleton variant="text" width="100%" height={32} sx={{ borderRadius: '4px' }} />
                  <Skeleton variant="text" width="100%" height={32} sx={{ borderRadius: '4px' }} />
                  <Skeleton variant="text" width="100%" height={32} sx={{ borderRadius: '4px' }} />
                  <Skeleton variant="text" width="100%" height={32} sx={{ borderRadius: '4px' }} />
                  <Skeleton variant="text" width="100%" height={32} sx={{ borderRadius: '4px' }} />
                  <Skeleton variant="text" width="100%" height={32} sx={{ borderRadius: '4px' }} />
                  <Skeleton variant="text" width="80%" height={32} sx={{ borderRadius: '4px' }} />
                </>
              ) : (
                <Typography
                  sx={{
                    width: '1090px',
                    fontFamily: 'S-Core Dream',
                    fontWeight: 200,
                    fontSize: '18px',
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

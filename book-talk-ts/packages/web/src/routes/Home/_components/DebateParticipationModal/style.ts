import styled from '@emotion/styled';
import { Box, Button, Typography } from '@mui/material';

export const ModalContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  padding: '40px 60px 40px 40px',
  boxSizing: 'border-box',
  width: '100%',
});

export const InnerWrapper = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: '20px',
  width: '780px',
});

export const ContentArea = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '60px',
  width: '780px',
});

/** Use variant="labelL" from parent */
export const ModalTitle = styled(Typography)({
  textAlign: 'center',
  color: '#262626',
});

export const ContentRow = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  gap: '30px',
  width: '780px',
});

export const BookProfile = styled(Button)({
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '10px',
  gap: '5px',
  width: '100px',
  minWidth: '100px',
  height: '140px',
  border: '1px solid #E8EBFF',
  borderRadius: '10px',
  background: 'none',
  transition: 'border-color 0.2s',
  '&:hover': {
    borderColor: '#8E99FF',
    background: 'none',
  },
});

export const BookImageBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'imageUrl',
})<{ imageUrl?: string | null }>(({ imageUrl }) => ({
  width: '61px',
  height: '89px',
  backgroundColor: '#ECECEC',
  ...(imageUrl && { backgroundImage: `url(${imageUrl})` }),
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
}));

/** Use variant="captionS" from parent */
export const BookInfoLink = styled(Typography)({
  textAlign: 'center',
  textDecoration: 'underline',
  color: '#262626',
  cursor: 'pointer',
});

export const InfoColumn = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '24px',
  flex: 1,
  minWidth: 0,
});

export const TextSection = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '10px',
  width: '100%',
});

/** Use variant="labelL" from parent */
export const DebateTopic = styled(Typography)({
  color: '#262626',
  height: '48px',
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
});

/** Use variant="body2" from parent */
export const DebateDescription = styled(Typography)({
  color: '#262626',
  height: '230px',
  display: '-webkit-box',
  WebkitLineClamp: 8,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
});

export const Divider = styled(Box)({
  width: '100%',
  height: '1px',
  backgroundColor: '#E8EBFF',
});

export const MetaSection = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '8px',
});

export const MetaRow = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '10px',
});

export const DateTimeGroup = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '8px',
});

/** Use variant="labelL" from parent */
export const MetaLabel = styled(Typography)({
  color: '#262626',
});

/** Use variant="body2" from parent */
export const MetaValue = styled(Typography)({
  color: '#262626',
});

export const WarningNotice = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  gap: '3px',
});

/** Use variant="captionS" from parent */
export const WarningAsterisk = styled(Typography)({
  color: '#FF5D22',
});

/** Use variant="captionS" from parent */
export const WarningText = styled(Typography)({
  color: '#262626',
});

export const ButtonRow = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  gap: '8px',
});

export const ButtonSection = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '8px',
  width: '250px',
});

/** Use variant="captionS" from parent */
export const Caption = styled(Typography)({
  color: '#262626',
});

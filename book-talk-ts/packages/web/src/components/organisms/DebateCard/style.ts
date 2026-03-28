import { PermIdentity } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

export const CardBody = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  padding: '12px 19px 18px',
  gap: 8,
  overflow: 'hidden',
  backgroundColor: 'var(--card-body-bg, transparent)',
  transition: 'background-color 0.2s ease',
});

export const CardRoot = styled(Box)({
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  width: 281,
  height: 390,
  borderRadius: '18px',
  border: '1px solid transparent',
  background:
    'linear-gradient(#ffffff, #ffffff) padding-box, linear-gradient(180deg, #AACDFF 0%, #5F84FF 100%) border-box',
  overflow: 'hidden',
  flexShrink: 0,
  cursor: 'pointer',
  userSelect: 'none',
  transition: 'opacity 0.2s ease, transform 0.1s ease',
  '&:hover': {
    '--card-body-bg': '#E8EBFF',
    '& .MuiButtonBase-root': {
      background:
        'linear-gradient(#ffffff, #ffffff) padding-box, linear-gradient(180deg, #AACDFF 0%, #5F84FF 100%) border-box !important',
    },
  },
});

export const CardImageWrapper = styled(Box)({
  width: '100%',
  height: 163,
  flexShrink: 0,
  overflow: 'hidden',
});

export const CardImage = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'imageUrl',
})<{ imageUrl?: string | null }>(({ imageUrl }) => ({
  width: '100%',
  height: '100%',
  backgroundImage: imageUrl ? `url(${imageUrl})` : undefined,
  backgroundColor: imageUrl ? undefined : '#FBEAE7',
  backgroundSize: 'cover',
  backgroundPosition: 'center top',
}));

export const CardTitleSection = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  flexShrink: 0,
});

export const CardDivider = styled(Box)({
  width: '100%',
  borderTop: '1px solid #D3DDEC',
});

export const CardPeopleRow = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  height: 24,
  marginTop: 'auto',
  flexShrink: 0,
});

export const CardPersonIcon = styled(PermIdentity)({
  fontSize: 20,
  color: '#262626',
});

export const CardCountGroup = styled(Box)({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  gap: '3px',
  width: 40,
  height: 24,
});

export const CardMaxCountWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  alignSelf: 'flex-end',
});

/** fontSize 10 — no matching design system variant */
export const CardMaxCount = styled(Typography)({
  fontFamily: 'S-Core Dream',
  fontWeight: 500,
  fontSize: 10,
  lineHeight: 1.5,
  textAlign: 'center',
  letterSpacing: '-0.011em',
  color: '#262626',
});

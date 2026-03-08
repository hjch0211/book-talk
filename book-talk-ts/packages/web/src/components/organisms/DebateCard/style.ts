import { PermIdentity } from '@mui/icons-material';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

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

export const CardBody = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  padding: '12px 19px 18px',
  gap: 8,
  overflow: 'hidden',
});

export const CardClubTitle = styled(Typography)({
  fontFamily: 'S-Core Dream',
  fontStyle: 'normal',
  fontWeight: 500,
  fontSize: 12,
  lineHeight: '20px',
  letterSpacing: '1px',
  color: '#000000',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  flexShrink: 0,
});

export const CardTitleSection = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  flexShrink: 0,
});

export const CardDivider = styled(Box)({
  width: '100%',
  borderTop: '1px solid #D3DDEC',
});

export const CardTopic = styled(Typography)({
  fontStyle: 'normal',
  fontWeight: 500,
  fontSize: 14,
  lineHeight: '20px',
  letterSpacing: '0.3px',
  color: '#000000',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  flexShrink: 0,
});

export const CardDescription = styled(Typography)`
  font-style: normal;
  font-weight: 200;
  font-size: 12px;
  line-height: 150%;
  letter-spacing: 0.3px;
  color: #000000;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`;

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

export const CardCurrentCount = styled(Typography)({
  fontFamily: 'S-Core Dream',
  fontStyle: 'normal',
  fontWeight: 500,
  fontSize: 16,
  lineHeight: '24px',
  textAlign: 'center',
  letterSpacing: '1px',
  color: '#262626',
});

export const CardMaxCountWrapper = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  alignSelf: 'flex-end',
  marginBottom: '3px',
});

export const CardMaxCount = styled(Typography)({
  fontFamily: 'S-Core Dream',
  fontStyle: 'normal',
  fontWeight: 500,
  fontSize: 10,
  lineHeight: '150%',
  textAlign: 'center',
  letterSpacing: '-0.011em',
  color: '#262626',
});

export const CardDate = styled(Typography)({
  fontFamily: 'S-Core Dream',
  fontStyle: 'normal',
  fontWeight: 200,
  fontSize: 12,
  lineHeight: '150%',
  letterSpacing: '0.3px',
  color: '#262626',
});

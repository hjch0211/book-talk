import { styled } from '@mui/material/styles';
import { Link } from 'react-router-dom';

export const HeroSection = styled('section')(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '760px',
  [theme.breakpoints.down('md')]: {
    height: 'auto',
    paddingBottom: '80px',
  },
}));

export const HeroDecorLeft = styled('img')(({ theme }) => ({
  position: 'absolute',
  left: '-50px',
  top: '100px',
  pointerEvents: 'none',
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));

export const HeroDecorRight = styled('img')(({ theme }) => ({
  position: 'absolute',
  right: '-60px',
  top: '350px',
  pointerEvents: 'none',
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));

export const HeroInner = styled('div')(({ theme }) => ({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '40px',
  top: '150px',
  [theme.breakpoints.down('md')]: {
    top: '0',
    padding: '80px 24px 0',
    alignItems: 'center',
  },
}));

export const HeroTextRow = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'flex-end',
  gap: '6px',
  width: '100%',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: '32px',
  },
}));

export const HeroHeadline = styled('h1')(({ theme }) => ({
  width: '878px',
  margin: '0',
  fontFamily: "'S-Core Dream', sans-serif",
  fontStyle: 'normal',
  fontWeight: 300,
  fontSize: '64px',
  lineHeight: '170%',
  letterSpacing: '0.3px',
  color: '#262626',
  [theme.breakpoints.down('md')]: {
    width: '100%',
    fontSize: '36px',
    textAlign: 'center',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '28px',
  },
}));

export const HeroHeadHighlight = styled('span')({
  color: '#8E99FF',
});

export const HeroCTAButton = styled('button')({
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '16px 32px',
  width: 'fit-content',
  height: '59px',
  background:
    'linear-gradient(#FFFFFF, #FFFFFF) padding-box, linear-gradient(183.73deg, #AACDFF 50.78%, #5F84FF 96.94%) border-box',
  border: '1px solid transparent',
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
  borderRadius: '48px',
  cursor: 'pointer',
  flex: 'none',
  transition: 'box-shadow 0.2s ease, transform 0.2s ease',
  '&:hover': {
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
    transform: 'translateY(-2px)',
  },
});

export const HeroCTAText = styled('span')({
  fontFamily: "'S-Core Dream', sans-serif",
  fontWeight: 500,
  fontSize: '18px',
  lineHeight: '150%',
  textAlign: 'center',
  letterSpacing: '1px',
  color: '#262626',
});

/* ─── Features ─── */
export const FeaturesSection = styled('section')(({ theme }) => ({
  width: '1200px',
  margin: '0 auto 200px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '60px',
  [theme.breakpoints.down('md')]: {
    width: '100%',
    padding: '0 24px',
    boxSizing: 'border-box',
    margin: '0 auto 100px',
  },
}));

export const SectionTitle = styled('h2')(({ theme }) => ({
  margin: '0',
  fontFamily: "'S-Core Dream', sans-serif",
  fontWeight: 600,
  fontSize: '48px',
  lineHeight: '170%',
  letterSpacing: '0.3px',
  color: '#262626',
  [theme.breakpoints.down('md')]: {
    fontSize: '32px',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '24px',
  },
}));

export const FeaturesGrid = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'flex-start',
  gap: '10px',
  width: '100%',
  [theme.breakpoints.down('md')]: {
    flexDirection: 'column',
    gap: '40px',
  },
}));

export const FeatureItem = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '24px',
  width: '588px',
  [theme.breakpoints.down('md')]: {
    width: '100%',
  },
}));

export const FeatureLabel = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '18px',
  width: '100%',
});

export const FeatureBadge = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '41px',
  height: '41px',
  background: '#FFCDBD',
  border: '1px solid #262626',
  borderRadius: '28px',
  fontFamily: "'S-Core Dream', sans-serif",
  fontWeight: 600,
  fontSize: '24px',
  lineHeight: '170%',
  letterSpacing: '0.3px',
  color: '#262626',
  flexShrink: 0,
});

export const FeatureLabelText = styled('span')({
  fontFamily: "'S-Core Dream', sans-serif",
  fontWeight: 600,
  fontSize: '24px',
  lineHeight: '170%',
  letterSpacing: '0.3px',
  color: '#262626',
});

export const ExampleCard = styled('div')(({ theme }) => ({
  position: 'relative',
  width: '588px',
  height: '484px',
  borderRadius: '22px',
  overflow: 'visible',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  [theme.breakpoints.down('md')]: {
    width: '100%',
    height: '300px',
  },
}));

export const ExampleCardImage = styled('img')({
  width: 'fit-content',
  maxWidth: '100%',
  height: '100%',
  objectFit: 'contain',
  borderRadius: '10px',
  display: 'block',
});

export const MoreLink = styled(Link)({
  fontFamily: "'S-Core Dream', sans-serif",
  fontWeight: 500,
  fontSize: '14px',
  lineHeight: '20px',
  letterSpacing: '0.3px',
  color: '#434343',
  textDecoration: 'none',
  alignSelf: 'flex-end',
  cursor: 'pointer',
  '&:hover': {
    color: '#8E99FF',
    textDecoration: 'underline',
  },
});

/* ─── Process ─── */
export const ProcessOuter = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '250px',
  width: '1200px',
  margin: '0 auto',
  paddingBottom: '200px',
  [theme.breakpoints.down('md')]: {
    width: '100%',
    padding: '0 24px 100px',
    boxSizing: 'border-box',
    gap: '80px',
  },
}));

export const ProcessSection = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  padding: '0',
  gap: '60px',
  width: '1200px',
  [theme.breakpoints.down('md')]: {
    width: '100%',
  },
}));

export const ProcessStepsContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '170px',
  width: '1200px',
  [theme.breakpoints.down('md')]: {
    width: '100%',
    gap: '80px',
  },
}));

export const ProcessStep = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '36px',
  width: '1200px',
  [theme.breakpoints.down('md')]: {
    width: '100%',
  },
}));

export const ProcessTabs = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  alignItems: 'center',
  alignContent: 'flex-start',
  rowGap: '0',
  [theme.breakpoints.down('md')]: {
    gap: '4px',
  },
}));

export const ProcessTabConnector = styled('div')(({ theme }) => ({
  width: '18px',
  height: '0',
  border: '2px solid #D9D9D9',
  [theme.breakpoints.down('md')]: {
    width: '8px',
  },
}));

interface TabProps {
  $active: boolean;
}

export const ProcessTab = styled('div')<TabProps>(({ $active, theme }) => ({
  boxSizing: 'border-box',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '4px 18px',
  gap: '10px',
  height: '35px',
  background: $active ? '#F7F8FF' : '#F5F5F5',
  border: $active ? '1px solid #8E99FF' : 'none',
  borderRadius: '48px',
  fontFamily: "'S-Core Dream', sans-serif",
  fontWeight: 500,
  fontSize: '18px',
  lineHeight: '150%',
  letterSpacing: '1px',
  color: '#262626',
  flex: 'none',
  flexGrow: 0,
  [theme.breakpoints.down('md')]: {
    fontSize: '13px',
    padding: '4px 12px',
    height: '30px',
    letterSpacing: '0.3px',
  },
}));

interface ContentProps {
  $gap?: string;
  $justify?: string;
}

export const ProcessContent = styled('div')<ContentProps>(({ theme, $gap, $justify }) => ({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'flex-start',
  gap: $gap ?? '48px',
  justifyContent: $justify ?? 'flex-start',
  width: '1200px',
  height: '470px',
  [theme.breakpoints.down('md')]: {
    width: '100%',
    height: 'auto',
    flexDirection: 'column',
    gap: '32px',
  },
}));

interface PlaceholderProps {
  $prepare?: boolean;
}

export const ProcessImagePlaceholder = styled('div')<PlaceholderProps>(({ $prepare }) =>
  $prepare
    ? {
        boxSizing: 'border-box',
        width: '542px',
        height: '460px',
        border: '1px solid #D9D9D9',
        borderRadius: '17px',
        background: '#F5F5F5',
      }
    : {
        position: 'absolute',
        inset: '0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#8E99FF',
        fontFamily: "'S-Core Dream', sans-serif",
        fontSize: '16px',
        fontWeight: 500,
        letterSpacing: '0.3px',
        opacity: 0.6,
      }
);

interface DescriptionProps {
  $width?: string;
}

export const ProcessDescription = styled('div')<DescriptionProps>({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '48px',
  height: '100%',
  flexShrink: 0,
  justifyContent: 'start',
});

export const ProcessDescInner = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '10px',
});

export const ProcessSubTitle = styled('h3')(({ theme }) => ({
  margin: '0',
  fontFamily: "'S-Core Dream', sans-serif",
  fontWeight: 600,
  fontSize: '28px',
  lineHeight: '150%',
  letterSpacing: '0.3px',
  color: '#262626',
  [theme.breakpoints.down('md')]: {
    fontSize: '22px',
  },
}));

export const ProcessSubDesc = styled('p')(({ theme }) => ({
  margin: '0',
  fontFamily: "'S-Core Dream', sans-serif",
  fontWeight: 500,
  fontSize: '20px',
  lineHeight: '170%',
  letterSpacing: '0.3px',
  color: '#262626',
  [theme.breakpoints.down('md')]: {
    fontSize: '16px',
  },
}));

export const ProcessBodyText = styled('p')(({ theme }) => ({
  margin: '0',
  fontFamily: "'S-Core Dream', sans-serif",
  fontWeight: 200,
  fontSize: '18px',
  lineHeight: '180%',
  letterSpacing: '0.3px',
  color: '#262626',
  [theme.breakpoints.down('md')]: {
    fontSize: '14px',
  },
}));

export const ProcessBodySmall = styled('p')({
  margin: '0',
  fontFamily: "'S-Core Dream', sans-serif",
  fontWeight: 200,
  fontSize: '16px',
  lineHeight: '180%',
  letterSpacing: '0.3px',
  color: '#262626',
});

export const ProcessBulletList = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '10px',
});

export const FooterContainer = styled('footer')({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  width: '100vw',
  padding: '24px 0',
  bottom: '0',
  background: 'linear-gradient(180deg, #FFFFFF 5%, #8E99FF 100%)',
});

export const FooterBigText = styled('img')({
  width: '100%',
});

export const FooterLinks = styled('div')(({ theme }) => ({
  display: 'flex',
  width: '1440px',
  flexDirection: 'row',
  justifyContent: 'start',
  gap: '70px',
  zIndex: 10,
  [theme.breakpoints.down('xl')]: {
    width: '100%',
    padding: '0 24px',
    boxSizing: 'border-box',
  },
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    gap: '8px',
  },
}));

export const FooterMenuGroup = styled('div')({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: '12px',
});

export const FooterLink = styled('a')({
  fontFamily: "'S-Core Dream', sans-serif",
  fontWeight: 500,
  fontSize: '12px',
  lineHeight: '150%',
  letterSpacing: '0.3px',
  color: '#262626',
  textDecoration: 'none',
  cursor: 'pointer',
  '&:hover': {
    textDecoration: 'underline',
  },
});

export const FooterNavLink = styled(Link)({
  fontFamily: "'S-Core Dream', sans-serif",
  fontWeight: 500,
  fontSize: '12px',
  lineHeight: '150%',
  letterSpacing: '0.3px',
  color: '#262626',
  textDecoration: 'none',
  '&:hover': {
    textDecoration: 'underline',
  },
});

export const FooterSeparator = styled('span')({
  fontFamily: "'S-Core Dream', sans-serif",
  fontWeight: 200,
  fontSize: '12px',
  lineHeight: '150%',
  letterSpacing: '0.3px',
  color: '#262626',
});

export const FooterCopyright = styled('span')({
  fontFamily: "'S-Core Dream', sans-serif",
  fontWeight: 200,
  fontSize: '12px',
  lineHeight: '150%',
  letterSpacing: '0.3px',
  color: '#555555',
});

import styled from '@emotion/styled';
import { Link } from 'react-router-dom';

export const HeroSection = styled.section`
    position: relative;  
    width: 100%;
    height: 760px;
`;

export const HeroDecorLeft = styled.img`
    position: absolute;
    left: -50px;
    top: 100px;
    pointer-events: none;
`;

export const HeroDecorRight = styled.img`
    position: absolute;
    right: -60px;
    top: 350px;
    pointer-events: none;
`;

export const HeroInner = styled.div`
    position: relative;  
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 40px;
    top: 150px
`;

export const HeroTextRow = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: flex-end;
    gap: 6px;
    width: 100%;
`;

export const HeroHeadline = styled.h1`
    width: 878px;
    margin: 0;
    font-family: 'S-Core Dream', sans-serif;
    font-style: normal;
    font-weight: 300;
    font-size: 64px;
    line-height: 170%;
    letter-spacing: 0.3px;
    color: #262626;
`;

export const HeroHeadHighlight = styled.span`
  color: #8E99FF;
`;

export const HeroCTAButton = styled.button`
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 16px 32px;
    width: fit-content;
    height: 59px;
    background: linear-gradient(#FFFFFF, #FFFFFF) padding-box,
                linear-gradient(183.73deg, #AACDFF 50.78%, #5F84FF 96.94%) border-box;
    border: 1px solid transparent;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
    border-radius: 48px;
    cursor: pointer;
    flex: none;
    transition: box-shadow 0.2s ease, transform 0.2s ease;

    &:hover {
        box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.2);
        transform: translateY(-2px);
    }
`;

export const HeroCTAText = styled.span`
    font-family: 'S-Core Dream', sans-serif;
    font-weight: 500;
    font-size: 18px;
    line-height: 150%;
    text-align: center;
    letter-spacing: 1px;
    color: #262626;
`;

/* ─── Features ─── */
export const FeaturesSection = styled.section`
    width: 1200px;
    margin: 0 auto 200px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 60px;
`;

export const SectionTitle = styled.h2`
    margin: 0;
    font-family: 'S-Core Dream', sans-serif;
    font-weight: 600;
    font-size: 48px;
    line-height: 170%;
    letter-spacing: 0.3px;
    color: #262626;
`;

export const FeaturesGrid = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
    gap: 10px;
    width: 100%;
`;

export const FeatureItem = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;
    width: 588px;
`;

export const FeatureLabel = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 18px;
    width: 100%;
`;

export const FeatureBadge = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 41px;
    height: 41px;
    background: #FFCDBD;
    border: 1px solid #262626;
    border-radius: 28px;
    font-family: 'S-Core Dream', sans-serif;
    font-weight: 600;
    font-size: 24px;
    line-height: 170%;
    letter-spacing: 0.3px;
    color: #262626;
    flex-shrink: 0;
`;

export const FeatureLabelText = styled.span`
    font-family: 'S-Core Dream', sans-serif;
    font-weight: 600;
    font-size: 24px;
    line-height: 170%;
    letter-spacing: 0.3px;
    color: #262626;
`;

export const FeatureCard = styled.div`
    position: relative;
    width: 588px;
    height: 484px;
    background: #FFFFFF;
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.08);
`;

export const FeatureCardGradient = styled.div`
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0) 75%, rgba(142, 153, 255, 0.3) 100%);
    z-index: 1;
`;

export const FeatureCardContent = styled.div`
    position: absolute;
    inset: 0;
    overflow: hidden;
`;

export const MoreLink = styled(Link)`
    font-family: 'S-Core Dream', sans-serif;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.3px;
    color: #434343;
    text-decoration: none;
    align-self: flex-end;
    cursor: pointer;

    &:hover {
        color: #8E99FF;
        text-decoration: underline;
    }
`;

/* ─── Process ─── */
export const ProcessOuter = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 250px;
    width: 1200px;
    margin: 0 auto;
    padding-bottom: 200px;
`;

export const ProcessSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0;
    gap: 60px;
    width: 1200px;
`;

export const ProcessStepsContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 170px;
    width: 1200px;
`;

export const ProcessStep = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 36px;
    width: 1200px;
`;

export const ProcessTabs = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    align-content: flex-start;
    row-gap: 0;
`;

export const ProcessTabConnector = styled.div`
    width: 18px;
    height: 0;
    border: 2px solid #D9D9D9;
`;

interface TabProps {
  $active: boolean;
}

export const ProcessTab = styled.div<TabProps>`
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 4px 18px;
    gap: 10px;
    height: 35px;
    background: ${({ $active }) => ($active ? '#F7F8FF' : '#F5F5F5')};
    border: ${({ $active }) => ($active ? '1px solid #8E99FF' : 'none')};
    border-radius: 48px;
    font-family: 'S-Core Dream', sans-serif;
    font-weight: 500;
    font-size: 18px;
    line-height: 150%;
    letter-spacing: 1px;
    color: #262626;
    flex: none;
    flex-grow: 0;
`;

interface ContentProps {
  $gap?: string;
  $justify?: string;
}

export const ProcessContent = styled.div<ContentProps>`
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: ${({ $gap }) => $gap ?? '48px'};
    justify-content: ${({ $justify }) => $justify ?? 'flex-start'};
    width: 1200px;
    height: 470px;
`;

interface ImageCardProps {
  $prepare?: boolean;
}

export const ProcessImageCard = styled.div<ImageCardProps>`
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
    width: 662px;
    height: 470px;
    border-radius: 24px;
    flex-shrink: 0;
    ${({ $prepare }) =>
      $prepare
        ? `
        background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(142, 153, 255, 0.2) 84.62%), #FFFFFF;
        padding: 0px 90px 100px 60px;
        `
        : ''}
`;

export const ProcessCardGradient = styled.div`
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(142, 153, 255, 0.1) 84.62%);
    pointer-events: none;
    z-index: 1;
`;

interface PlaceholderProps {
  $prepare?: boolean;
}

export const ProcessImagePlaceholder = styled.div<PlaceholderProps>`
    ${({ $prepare }) =>
      $prepare
        ? `
    box-sizing: border-box;
    width: 542px;
    height: 460px;
    border: 1px solid #D9D9D9;
    border-radius: 17px;
    background: #F5F5F5;
    `
        : `
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #8E99FF;
    font-family: 'S-Core Dream', sans-serif;
    font-size: 16px;
    font-weight: 500;
    letter-spacing: 0.3px;
    opacity: 0.6;
    `}
`;

interface DescriptionProps {
  $width?: string;
}

export const ProcessDescription = styled.div<DescriptionProps>`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 48px;
    width: ${({ $width }) => $width ?? '427px'};
    height: 470px;
    flex-shrink: 0;
    justify-content: center;
`;

export const ProcessDescInner = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
`;

export const ProcessSubTitle = styled.h3`
    margin: 0;
    font-family: 'S-Core Dream', sans-serif;
    font-weight: 600;
    font-size: 28px;
    line-height: 150%;
    letter-spacing: 0.3px;
    color: #262626;
`;

export const ProcessSubDesc = styled.p`
    margin: 0;
    font-family: 'S-Core Dream', sans-serif;
    font-weight: 500;
    font-size: 20px;
    line-height: 170%;
    letter-spacing: 0.3px;
    color: #262626;
`;

export const ProcessBodyText = styled.p`
    margin: 0;
    font-family: 'S-Core Dream', sans-serif;
    font-weight: 200;
    font-size: 18px;
    line-height: 180%;
    letter-spacing: 0.3px;
    color: #262626;
`;

export const ProcessBodySmall = styled.p`
    margin: 0;
    font-family: 'S-Core Dream', sans-serif;
    font-weight: 200;
    font-size: 16px;
    line-height: 180%;
    letter-spacing: 0.3px;
    color: #262626;
`;

export const ProcessBulletList = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
`;

/* ─── Footer ─── */
export const FooterContainer = styled.footer`
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100vw;  
    padding: 24px 0;
    bottom: 0;
    background: linear-gradient(180deg, #FFFFFF 5%, #8E99FF 100%);
`;

export const FooterBigText = styled.div`
    width: 100%;
    bottom: 100px;
    text-align: center;
    font-feature-settings: 'liga' off, 'clig' off;
    -webkit-text-stroke-width: 2px;
    -webkit-text-stroke-color: #FFF;
    font-size: 300px;
    font-style: normal;
    font-weight: 900;
    line-height: 150%;
    letter-spacing: -17px;
    color: transparent;
    white-space: nowrap;
    user-select: none;
`;

export const FooterLinks = styled.div`
    display: flex;
    width: 1440px;
    flex-direction: row;
    justify-content: start;
    gap: 70px;
    z-index: 10;
`;

export const FooterMenuGroup = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 12px;
`;

export const FooterLink = styled.a`
    font-family: 'S-Core Dream', sans-serif;
    font-weight: 500;
    font-size: 12px;
    line-height: 150%;
    letter-spacing: 0.3px;
    color: #262626;
    text-decoration: none;
    cursor: pointer;

    &:hover {
        text-decoration: underline;
    }
`;

export const FooterNavLink = styled(Link)`
    font-family: 'S-Core Dream', sans-serif;
    font-weight: 500;
    font-size: 12px;
    line-height: 150%;
    letter-spacing: 0.3px;
    color: #262626;
    text-decoration: none;

    &:hover {
        text-decoration: underline;
    }
`;

export const FooterSeparator = styled.span`
    font-family: 'S-Core Dream', sans-serif;
    font-weight: 200;
    font-size: 12px;
    line-height: 150%;
    letter-spacing: 0.3px;
    color: #262626;
`;

export const FooterCopyright = styled.span`
    font-family: 'S-Core Dream', sans-serif;
    font-weight: 200;
    font-size: 12px;
    line-height: 150%;
    letter-spacing: 0.3px;
    color: #555555;
`;

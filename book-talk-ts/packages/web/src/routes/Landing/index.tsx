import handsUpExample from '@src/assets/landing/hands-up-example.png';
import heroDeco1 from '@src/assets/landing/hero-deco-1.svg';
import heroDeco2 from '@src/assets/landing/hero-deco-2.svg';
import landingExample1 from '@src/assets/landing/landing-example-1.png';
import landingExample2 from '@src/assets/landing/landing-example-2.png';
import preparationExample from '@src/assets/landing/preparation-example.png';
import round1Example from '@src/assets/landing/round-1-example.png';
import round2Example from '@src/assets/landing/round-2-example.png';
import tooltipExample from '@src/assets/landing/tooltip-example.png';
import { AppButton } from '@src/components/molecules/AppButton';
import AppHeader from '@src/components/organisms/AppHeader';
import PageContainer from '@src/components/templates/PageContainer';
import { urls } from '@src/constants/urls.ts';
import { useNavigate } from 'react-router-dom';
import {
  FeatureBadge,
  FeatureCard,
  FeatureCardContent,
  FeatureCardGradient,
  FeatureItem,
  FeatureLabel,
  FeatureLabelText,
  FeaturesGrid,
  FeaturesSection,
  FooterBigText,
  FooterContainer,
  FooterCopyright,
  FooterLink,
  FooterLinks,
  FooterNavLink,
  FooterMenuGroup,
  FooterSeparator,
  HeroDecorLeft,
  HeroDecorRight,
  HeroHeadHighlight,
  HeroHeadline,
  HeroInner,
  HeroSection,
  HeroTextRow,
  MoreLink,
  ProcessBodySmall,
  ProcessBodyText,
  ProcessBulletList,
  ProcessCardGradient,
  ProcessContent,
  ProcessDescInner,
  ProcessDescription,
  ProcessImageCard,
  ProcessOuter,
  ProcessSection,
  ProcessStep,
  ProcessStepsContainer,
  ProcessSubDesc,
  ProcessSubTitle,
  ProcessTab,
  ProcessTabConnector,
  ProcessTabs,
  SectionTitle,
} from './style';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <AppHeader />
      <HeroSection>
        <HeroDecorLeft src={heroDeco1} alt="" aria-hidden="true" />
        <HeroDecorRight src={heroDeco2} alt="" aria-hidden="true" />
        <HeroInner>
          <HeroTextRow>
            <HeroHeadline>
              <HeroHeadHighlight>사람모으기는</HeroHeadHighlight> 어렵고,
              <br />
              관심 없는 책을 <HeroHeadHighlight>선택하기는 싫고</HeroHeadHighlight>
              <br />
              <HeroHeadHighlight>혼자 읽자니</HeroHeadHighlight> 동기가 부족하고
            </HeroHeadline>
            <AppButton appVariant="rounded" hoverAnimation onClick={() => navigate('/home')}>
              {'토론방 홈으로 가기 >'}
            </AppButton>
          </HeroTextRow>
        </HeroInner>
      </HeroSection>

      <FeaturesSection>
        <SectionTitle>이제는 북톡에서 토론하세요!</SectionTitle>
        <FeaturesGrid>
          <FeatureItem>
            <FeatureLabel>
              <FeatureBadge>A</FeatureBadge>
              <FeatureLabelText>원하는 책의 토론방을 직접 만들거나</FeatureLabelText>
            </FeatureLabel>
            <FeatureCard>
              <FeatureCardContent>
                <img
                  src={landingExample1}
                  alt="토론방 만들기 예시"
                  style={{ position: 'absolute', width: 499, left: 45, top: -41 }}
                />
              </FeatureCardContent>
              <FeatureCardGradient />
            </FeatureCard>
          </FeatureItem>
          <FeatureItem>
            <FeatureLabel>
              <FeatureBadge>B</FeatureBadge>
              <FeatureLabelText>만들어진 토론방에 참여해요</FeatureLabelText>
            </FeatureLabel>
            <FeatureCard>
              <FeatureCardContent>
                <img
                  src={landingExample2}
                  alt="토론방 참여 예시"
                  style={{ position: 'absolute', height: 226, top: 129 }}
                />
              </FeatureCardContent>
              <FeatureCardGradient />
            </FeatureCard>
            <MoreLink to="/home">토론방 더보러가기 &gt;</MoreLink>
          </FeatureItem>
        </FeaturesGrid>
      </FeaturesSection>

      <ProcessOuter>
        <ProcessSection>
          <SectionTitle>토론 진행절차</SectionTitle>
          <ProcessStepsContainer>
            <ProcessStep>
              <ProcessTabs>
                <ProcessTab $active>토론 준비</ProcessTab>
                <ProcessTabConnector />
                <ProcessTab $active={false}>1 라운드</ProcessTab>
                <ProcessTabConnector />
                <ProcessTab $active={false}>2 라운드</ProcessTab>
              </ProcessTabs>
              <ProcessContent>
                <ProcessImageCard $prepare>
                  <img
                    src={preparationExample}
                    alt="발표 페이지 예시"
                    style={{
                      width: 542,
                      height: 460,
                    }}
                  />
                </ProcessImageCard>
                <ProcessDescription $width="343px">
                  <ProcessDescInner>
                    <ProcessSubTitle>토론준비</ProcessSubTitle>
                    <ProcessSubDesc>
                      토론 시작 전에는 자신의 발표페이지에
                      <br />
                      나누고 싶은 생각을 적습니다.
                    </ProcessSubDesc>
                  </ProcessDescInner>
                </ProcessDescription>
              </ProcessContent>
            </ProcessStep>

            {/* 1 라운드 */}
            <ProcessStep>
              <ProcessTabs>
                <ProcessTab $active={false}>토론 준비</ProcessTab>
                <ProcessTabConnector />
                <ProcessTab $active>1 라운드</ProcessTab>
                <ProcessTabConnector />
                <ProcessTab $active={false}>2 라운드</ProcessTab>
              </ProcessTabs>
              <ProcessContent $gap="120px" $justify="space-between">
                <ProcessDescription $width="427px">
                  <ProcessDescInner>
                    <ProcessSubTitle>1 라운드 - 발표</ProcessSubTitle>
                    <ProcessSubDesc>토론이 시작되면 한 명씩 돌아가면서 발표합니다.</ProcessSubDesc>
                  </ProcessDescInner>
                  <ProcessBodyText>
                    발표가 끝나면 발표 끝내기 버튼을 눌러서
                    <br />
                    다음 사람에게 발표를 넘깁니다.
                  </ProcessBodyText>
                </ProcessDescription>
                <ProcessImageCard>
                  <img
                    src={round1Example}
                    alt="1라운드 발표자 화면"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  <ProcessCardGradient />
                </ProcessImageCard>
              </ProcessContent>
            </ProcessStep>

            {/* 2 라운드 */}
            <ProcessStep>
              <ProcessTabs>
                <ProcessTab $active={false}>토론 준비</ProcessTab>
                <ProcessTabConnector />
                <ProcessTab $active={false}>1 라운드</ProcessTab>
                <ProcessTabConnector />
                <ProcessTab $active>2 라운드</ProcessTab>
              </ProcessTabs>
              <ProcessContent>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <ProcessImageCard>
                    <img
                      src={round2Example}
                      alt="2라운드 자유토론 화면"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    <img
                      src={handsUpExample}
                      alt="손들기 버튼"
                      style={{
                        position: 'absolute',
                        right: 31,
                        bottom: 56,
                        width: 100,
                        zIndex: 2,
                      }}
                    />
                    <ProcessCardGradient />
                  </ProcessImageCard>
                  <img
                    src={tooltipExample}
                    alt="발표 끝내기 버튼"
                    style={{
                      position: 'absolute',
                      right: -16,
                      top: 180,
                      width: 120,
                      zIndex: 2,
                    }}
                  />
                </div>
                <ProcessDescription $width="504px">
                  <ProcessDescInner>
                    <ProcessSubTitle>2 라운드 - 자유토론</ProcessSubTitle>
                    <ProcessSubDesc>
                      2 라운드에서는 채팅과 음성을 통해
                      <br />
                      자유롭게 토론합니다.
                    </ProcessSubDesc>
                  </ProcessDescInner>
                  <ProcessBulletList>
                    <ProcessBodySmall>
                      프로필을 눌러 참여자들의 발표 페이지를 다시 볼 수 있습니다.
                    </ProcessBodySmall>
                    <ProcessBodySmall>
                      손들기 버튼으로 손들고 발표 권한을 얻어 말할 수 있습니다.
                    </ProcessBodySmall>
                  </ProcessBulletList>
                </ProcessDescription>
              </ProcessContent>
            </ProcessStep>
          </ProcessStepsContainer>
        </ProcessSection>

        <AppButton appVariant="rounded" hoverAnimation onClick={() => navigate('/home')}>
          토론방 홈으로 가기 &gt;
        </AppButton>
      </ProcessOuter>

      <FooterContainer>
        <FooterBigText>BOOKTALK</FooterBigText>
        <FooterLinks>
          <FooterMenuGroup>
            <FooterNavLink to="/privacy">개인정보처리방침</FooterNavLink>
            <FooterSeparator>|</FooterSeparator>
            <FooterNavLink to="/terms-of-use">이용약관</FooterNavLink>
            <FooterSeparator>|</FooterSeparator>
            <FooterLink href={urls.INQUIRY} target="_blank" rel="noopener noreferrer">
              문의하기
            </FooterLink>
          </FooterMenuGroup>
          <FooterCopyright>© 2026 BookTalk. All rights reserved.</FooterCopyright>
        </FooterLinks>
      </FooterContainer>
    </PageContainer>
  );
}

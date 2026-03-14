import footerText from '@src/assets/landing/footer-text.png';
import heroDeco1 from '@src/assets/landing/hero-deco-1.svg';
import heroDeco2 from '@src/assets/landing/hero-deco-2.svg';
import landingExample1 from '@src/assets/landing/landing-example-1.png';
import landingExample2 from '@src/assets/landing/landing-example-2.png';
import preparationExample from '@src/assets/landing/preparation-example.png';
import round1Example from '@src/assets/landing/round-1-example.png';
import round2Example from '@src/assets/landing/round-2-example.png';
import { AppButton } from '@src/components/molecules/AppButton';
import AppHeader from '@src/components/organisms/AppHeader';
import PageContainer from '@src/components/templates/PageContainer';
import { urls } from '@src/constants/urls.ts';
import { motion, useMotionValue, useSpring, useTransform, type Variants } from 'framer-motion';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ExampleCard,
  ExampleCardImage,
  FeatureBadge,
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
  FooterMenuGroup,
  FooterNavLink,
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
  ProcessContent,
  ProcessDescInner,
  ProcessDescription,
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

/* ─── 공통 애니메이션 variants ─── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: 'easeOut' as const, delay },
  }),
};

/* ─── Hero 텍스트 단어별 stagger ─── */
const heroContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

const heroWord: Variants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.55, ease: 'easeOut' as const },
  },
};

/* ─── 마우스 parallax ─── */
function useParallax(strength = 20) {
  const ref = useRef<HTMLElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 80, damping: 20 });
  const springY = useSpring(y, { stiffness: 80, damping: 20 });
  const rotateX = useTransform(springY, [-1, 1], [strength / 2, -strength / 2]);
  const rotateY = useTransform(springX, [-1, 1], [-strength / 2, strength / 2]);

  const onMouseMove = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const onMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return { ref, rotateX, rotateY, onMouseMove, onMouseLeave };
}

const ScrollReveal = ({
  children,
  delay = 0,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  style?: React.CSSProperties;
}) => (
  <motion.div
    variants={fadeUp}
    custom={delay}
    initial="hidden"
    whileInView="visible"
    viewport={{ once: true, amount: 0.15 }}
    style={style}
  >
    {children}
  </motion.div>
);

export function LandingPage() {
  const navigate = useNavigate();
  const cardA = useParallax(12);
  const cardB = useParallax(12);

  return (
    <PageContainer>
      <AppHeader />
      <HeroSection>
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.1 }}
        >
          <HeroDecorLeft src={heroDeco1} alt="" aria-hidden="true" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.3 }}
        >
          <HeroDecorRight src={heroDeco2} alt="" aria-hidden="true" />
        </motion.div>

        <HeroInner>
          <HeroTextRow>
            <motion.div variants={heroContainer} initial="hidden" animate="visible">
              <HeroHeadline>
                <motion.span variants={heroWord}>
                  <HeroHeadHighlight>사람모으기는</HeroHeadHighlight>
                </motion.span>
                <motion.span variants={heroWord}> 어렵고,</motion.span>
                <br />
                <motion.span variants={heroWord}>관심 없는 책을 </motion.span>
                <motion.span variants={heroWord}>
                  <HeroHeadHighlight>선택하기는 싫고</HeroHeadHighlight>
                </motion.span>
                <br />
                <motion.span variants={heroWord}>
                  <HeroHeadHighlight>혼자 읽자니</HeroHeadHighlight>
                </motion.span>
                <motion.span variants={heroWord}> 동기가 부족하고</motion.span>
              </HeroHeadline>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: 'backOut', delay: 1.0 }}
            >
              <AppButton appVariant="rounded" hoverAnimation onClick={() => navigate('/home')}>
                {'토론방 홈으로 가기 >'}
              </AppButton>
            </motion.div>
          </HeroTextRow>
        </HeroInner>
      </HeroSection>

      <FeaturesSection>
        <ScrollReveal>
          <SectionTitle>이제는 북톡에서 토론하세요!</SectionTitle>
        </ScrollReveal>
        <FeaturesGrid>
          <ScrollReveal delay={0}>
            <FeatureItem>
              <FeatureLabel>
                <FeatureBadge>A</FeatureBadge>
                <FeatureLabelText>원하는 책의 토론방을 직접 만들거나</FeatureLabelText>
              </FeatureLabel>
              <motion.div
                style={{
                  rotateX: cardA.rotateX,
                  rotateY: cardA.rotateY,
                  transformStyle: 'preserve-3d',
                }}
                onMouseMove={cardA.onMouseMove}
                onMouseLeave={cardA.onMouseLeave}
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              >
                <ExampleCard>
                  <ExampleCardImage src={landingExample1} alt="토론방 만들기 예시" />
                </ExampleCard>
              </motion.div>
            </FeatureItem>
          </ScrollReveal>

          <ScrollReveal delay={0.15}>
            <FeatureItem>
              <FeatureLabel>
                <FeatureBadge>B</FeatureBadge>
                <FeatureLabelText>만들어진 토론방에 참여해요</FeatureLabelText>
              </FeatureLabel>
              <motion.div
                style={{
                  rotateX: cardB.rotateX,
                  rotateY: cardB.rotateY,
                  transformStyle: 'preserve-3d',
                }}
                onMouseMove={cardB.onMouseMove}
                onMouseLeave={cardB.onMouseLeave}
                whileHover={{ scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              >
                <ExampleCard>
                  <ExampleCardImage src={landingExample2} alt="토론방 참여 예시" />
                </ExampleCard>
              </motion.div>
              <MoreLink to="/home">토론방 더보러가기 &gt;</MoreLink>
            </FeatureItem>
          </ScrollReveal>
        </FeaturesGrid>
      </FeaturesSection>

      <ProcessOuter>
        <ProcessSection>
          <ScrollReveal>
            <SectionTitle>토론 진행절차</SectionTitle>
          </ScrollReveal>
          <ProcessStepsContainer>
            {[
              {
                active: [true, false, false] as [boolean, boolean, boolean],
                content: (
                  <ProcessContent>
                    <ExampleCard sx={{ width: { sm: '100%', md: '662px' } }}>
                      <ExampleCardImage src={preparationExample} alt="발표 페이지 예시" />
                    </ExampleCard>
                    <ProcessDescription>
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
                ),
              },
              {
                active: [false, true, false] as [boolean, boolean, boolean],
                content: (
                  <ProcessContent $gap="120px" $justify="space-between">
                    <ProcessDescription>
                      <ProcessDescInner>
                        <ProcessSubTitle>1 라운드 - 발표</ProcessSubTitle>
                        <ProcessSubDesc>
                          토론이 시작되면 한 명씩 돌아가면서 발표합니다.
                        </ProcessSubDesc>
                      </ProcessDescInner>
                      <ProcessBodyText>
                        발표가 끝나면 발표 끝내기 버튼을 눌러서
                        <br />
                        다음 사람에게 발표를 넘깁니다.
                      </ProcessBodyText>
                    </ProcessDescription>
                    <ExampleCard sx={{ width: { sm: '100%', md: '662px' } }}>
                      <ExampleCardImage src={round1Example} alt="1라운드 발표자 화면" />
                    </ExampleCard>
                  </ProcessContent>
                ),
              },
              {
                active: [false, false, true] as [boolean, boolean, boolean],
                content: (
                  <ProcessContent>
                    <ExampleCard sx={{ width: { sm: '100%', md: '661px' } }}>
                      <ExampleCardImage src={round2Example} alt="2라운드 자유토론 화면" />
                    </ExampleCard>
                    <ProcessDescription>
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
                ),
              },
            ].map(({ active, content }, i) => (
              <motion.div
                key={`${i + 1}`}
                variants={fadeUp}
                custom={i * 0.1}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
              >
                <ProcessStep>
                  <ProcessTabs>
                    <ProcessTab $active={active[0]}>토론 준비</ProcessTab>
                    <ProcessTabConnector />
                    <ProcessTab $active={active[1]}>1 라운드</ProcessTab>
                    <ProcessTabConnector />
                    <ProcessTab $active={active[2]}>2 라운드</ProcessTab>
                  </ProcessTabs>
                  {content}
                </ProcessStep>
              </motion.div>
            ))}
          </ProcessStepsContainer>
        </ProcessSection>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: 'backOut' }}
        >
          <AppButton appVariant="rounded" hoverAnimation onClick={() => navigate('/home')}>
            토론방 홈으로 가기 &gt;
          </AppButton>
        </motion.div>
      </ProcessOuter>

      {/* ── Footer ── */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{ duration: 0.8 }}
      >
        <FooterContainer>
          <FooterBigText src={footerText} alt="푸터 텍스트" />
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
      </motion.div>
    </PageContainer>
  );
}

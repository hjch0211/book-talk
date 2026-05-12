import heroImg from '@src/assets/logo.svg';
import { AppButton } from '@src/components/molecules/AppButton';
import { HeroImage, WelcomeContainer, WelcomeLogoGroup, WelcomeSubtitle } from './style';

interface Props {
  onStart: () => void;
}

export function WelcomeStep({ onStart }: Props) {
  return (
    <WelcomeContainer>
      <WelcomeLogoGroup>
        <HeroImage src={heroImg} alt="Booktalk AI" draggable={false} />
        <WelcomeSubtitle>Booktalk AI와 함께 토론을 시작해보세요</WelcomeSubtitle>
      </WelcomeLogoGroup>
      <AppButton
        fullWidth={false}
        onClick={onStart}
        sx={{ width: 286, height: 64, borderRadius: '18px' }}
      >
        시작하기
      </AppButton>
    </WelcomeContainer>
  );
}

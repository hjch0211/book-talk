import heroImg from '@src/assets/logo.svg';
import { CrayonButton } from '@src/components/molecules/CrayonButton';
import { HeroArea, HeroImage, WelcomeSubtitle } from './style';

interface Props {
  onStart: () => void;
}

export function WelcomeStep({ onStart }: Props) {
  return (
    <>
      <HeroArea>
        <HeroImage src={heroImg} alt="Booktalk AI" draggable={false} />
      </HeroArea>

      <WelcomeSubtitle>Booktalk AI와 함께 토론을 시작해보세요</WelcomeSubtitle>
      <CrayonButton onClick={onStart}>시작하기 →</CrayonButton>
    </>
  );
}

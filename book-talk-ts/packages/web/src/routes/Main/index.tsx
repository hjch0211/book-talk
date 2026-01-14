import { meQueryOption } from '@src/apis/account';
import { useModal } from '@src/hooks';
import { useSuspenseQuery } from '@tanstack/react-query';
import { Suspense } from 'react';
import MainHeader from '../../components/organisms/MainHeader';
import MainContainer from '../../components/templates/MainContainer';
import PageContainer from '../../components/templates/PageContainer';
import DebateCreationModal from './_components/DebateCreationModal';
import {
  ButtonContainer,
  MainButton,
  MainButtonText,
  MainText,
  MainTextContainer,
  MainTextWrapper,
  SurveyHyperLinkText,
} from './style.ts';

const TextSection = () => {
  const { data: me } = useSuspenseQuery(meQueryOption);

  return (
    <MainTextWrapper>
      <MainText>
        {me ? (
          <>
            안녕하세요 {me.name}님<br />
            아래 버튼을 눌러 토론을 시작해보세요!
          </>
        ) : (
          <>
            이제는 BOOKTALK과 함께
            <br />
            온라인으로 독서토론을 즐겨요!
          </>
        )}
      </MainText>
    </MainTextWrapper>
  );
};

const ButtonSection = () => {
  const { openModal } = useModal();

  const handleCreateDebate = () => {
    openModal(DebateCreationModal);
  };

  return (
    <MainButton onClick={handleCreateDebate}>
      <MainButtonText>토론방 생성하기</MainButtonText>
    </MainButton>
  );
};

export function MainPage() {
  return (
    <PageContainer bgColor="linear-gradient(180deg, #FFFFFF 39.9%, #FBEAE7 100%)">
      <MainContainer>
        <MainHeader />
        <MainTextContainer>
          <Suspense fallback={<></>}>
            <TextSection />
          </Suspense>

          <ButtonContainer>
            <Suspense fallback={<></>}>
              <ButtonSection />
            </Suspense>
          </ButtonContainer>

          <SurveyHyperLinkText
            href="https://docs.google.com/forms/d/e/1FAIpQLSeJS7YMm1S1qAQbUZkn7fHmm1Xyo9zV6L3cDfekLYdQq-BlUg/viewform"
            target="_blank"
            rel="noopener noreferrer"
          >
            북톡에 대한 의견을 남겨주세요!
          </SurveyHyperLinkText>
        </MainTextContainer>
      </MainContainer>
    </PageContainer>
  );
}

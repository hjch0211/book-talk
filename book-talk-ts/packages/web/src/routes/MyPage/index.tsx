import { BackButton } from '@src/components/molecules/BackButton';
import AppHeader from '@src/components/organisms/AppHeader';
import PageContainer from '@src/components/templates/PageContainer';
import type { FindAllDebateInfo } from '@src/externals/debate/schema';
import { useModal } from '@src/hooks';
import DebateDetailModal from '@src/routes/Home/_components/DebateDetailModal';
import { DebateManagementSection } from '@src/routes/MyPage/_components/DebateManagementSection';
import { MyInfoModificationSection } from '@src/routes/MyPage/_components/MyInfoModificationSection';
import { MyPageTab } from '@src/routes/MyPage/_components/MyPageTab';
import { BackNavRow, ContentWrapper, InnerWrapper, PageTitle } from './style';
import { useMyPage } from './useMyPage';

export function MyPage() {
  const { me, mainTab, setMainTab, navigateHome } = useMyPage();
  const { openModal } = useModal();

  const handleCardClick = (debate: FindAllDebateInfo) => {
    openModal(DebateDetailModal, { debate, myId: me?.id });
  };

  return (
    <PageContainer bgColor="#FFFFFF">
      <AppHeader />

      <BackNavRow>
        <BackButton onClick={navigateHome}>메인페이지로 가기</BackButton>
      </BackNavRow>

      <ContentWrapper>
        <InnerWrapper>
          <PageTitle>마이페이지</PageTitle>
          <MyPageTab
            mainTab={mainTab}
            onDebateManagementTabClick={() => setMainTab('debate-management')}
            onProfileSettingTabClick={() => setMainTab('profile-settings')}
          />
        </InnerWrapper>

        {mainTab === 'debate-management' && (
          <DebateManagementSection myId={me?.id} onCardClick={handleCardClick} />
        )}
        {mainTab === 'profile-settings' && <MyInfoModificationSection />}
      </ContentWrapper>
    </PageContainer>
  );
}

import { ArrowBack } from '@mui/icons-material';
import AppHeader from '@src/components/organisms/AppHeader';
import PageContainer from '@src/components/templates/PageContainer';
import type { FindAllDebateInfo } from '@src/externals/debate/schema';
import { useModal } from '@src/hooks';
import DebateParticipationModal from '@src/routes/Home/_components/DebateParticipationModal';
import { DebateManagementSection } from '@src/routes/MyPage/_components/DebateManagementSection';
import { MyInfoModificationSection } from '@src/routes/MyPage/_components/MyInfoModificationSection';
import { MyPageTab } from '@src/routes/MyPage/_components/MyPageTab';
import {
  BackNavContent,
  BackNavRow,
  BackNavText,
  ContentWrapper,
  InnerWrapper,
  PageTitle,
} from './style';
import { useMyPage } from './useMyPage';

export function MyPage() {
  const { me, mainTab, setMainTab, navigateHome } = useMyPage();
  const { openModal } = useModal();

  const handleCardClick = (debate: FindAllDebateInfo) => {
    openModal(DebateParticipationModal, { debate, myId: me?.id });
  };

  return (
    <PageContainer bgColor="#FFFFFF" isRelative>
      <AppHeader />

      <BackNavRow>
        <BackNavContent onClick={navigateHome}>
          <ArrowBack sx={{ width: 24, height: 24, color: '#434343' }} />
          <BackNavText>메인페이지로 가기</BackNavText>
        </BackNavContent>
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

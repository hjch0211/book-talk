import {
  TabIndicator,
  TabItem,
  TabItemText,
  TabNav,
  TabNavWrapper,
  TabSection,
} from '@src/routes/MyPage/_components/MyPageTab/style.ts';
import type { MainTab } from '@src/routes/MyPage/useMyPage.ts';

interface Props {
  mainTab: MainTab;
  onDebateManagementTabClick: () => void;
  onProfileSettingTabClick: () => void;
}

const TAB_INDICATOR_LEFT: Record<MainTab, number> = {
  'debate-management': 170,
  'profile-settings': 792,
};

export const MyPageTab = ({
  mainTab,
  onDebateManagementTabClick,
  onProfileSettingTabClick,
}: Props) => {
  return (
    <TabSection>
      <TabNavWrapper>
        <TabNav>
          <TabItem active={mainTab === 'debate-management'} onClick={onDebateManagementTabClick}>
            <TabItemText active={mainTab === 'debate-management'}>토론방 관리</TabItemText>
          </TabItem>
          <TabItem active={mainTab === 'profile-settings'} onClick={onProfileSettingTabClick}>
            <TabItemText active={mainTab === 'profile-settings'}>
              닉네임 / 비밀번호 변경
            </TabItemText>
          </TabItem>
          <TabIndicator indicatorLeft={TAB_INDICATOR_LEFT[mainTab]} />
        </TabNav>
      </TabNavWrapper>
    </TabSection>
  );
};

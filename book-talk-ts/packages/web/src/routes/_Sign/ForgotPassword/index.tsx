import AppHeader from '@src/components/organisms/AppHeader';
import PageContainer from '@src/components/templates/PageContainer';
import { SignContainer, SignTitle } from '../style';

// TODO: 디자인 반영하기
export function ForgotPasswordPage() {
  return (
    <PageContainer>
      <AppHeader />
      <SignContainer>
        <SignTitle>비밀번호 찾기</SignTitle>
      </SignContainer>
    </PageContainer>
  );
}

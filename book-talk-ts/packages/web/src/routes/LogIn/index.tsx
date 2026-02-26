import GoogleIcon from '@src/assets/sign/google-icon.svg';
import { AppButton } from '@src/components/molecules/AppButton';
import { AppTextField } from '@src/components/molecules/AppTextField';
import AppHeader from '@src/components/organisms/AppHeader';
import PageContainer from '@src/components/templates/PageContainer';
import {
  ButtonsSection,
  DividerContainer,
  DividerLine,
  DividerText,
  DividerTextWrapper,
  EmailSection,
  FieldsWrapper,
  ForgotPassword,
  LoginContainer,
  LoginFormSection,
  LoginTitle,
  SocialSection,
} from './style';

export function LogInPage() {
  return (
    <PageContainer>
      <AppHeader />
      <LoginContainer>
        <LoginTitle>로그인</LoginTitle>
        <LoginFormSection>
          <SocialSection>
            <AppButton appVariant="social" startIcon={<img src={GoogleIcon} alt="" />}>
              구글계정으로 빠르게 로그인하기
            </AppButton>
            <DividerContainer>
              <DividerLine />
              <DividerTextWrapper>
                <DividerText>Or continue with email</DividerText>
              </DividerTextWrapper>
            </DividerContainer>
          </SocialSection>
          <EmailSection>
            <FieldsWrapper>
              <AppTextField type="email" placeholder="이메일" />
              <AppTextField type="password" placeholder="비밀번호" />
            </FieldsWrapper>
            <ForgotPassword type="button">비밀번호를 잊어버렸나요?</ForgotPassword>
          </EmailSection>
          <ButtonsSection>
            <AppButton appVariant="filled">로그인</AppButton>
            <AppButton appVariant="outlined">회원가입</AppButton>
          </ButtonsSection>
        </LoginFormSection>
      </LoginContainer>
    </PageContainer>
  );
}

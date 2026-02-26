import GoogleIcon from '@src/assets/sign/google-icon.svg';
import { AppButton } from '@src/components/molecules/AppButton';
import { AppFieldMessage } from '@src/components/molecules/AppFieldMessage';
import { AppTextField } from '@src/components/molecules/AppTextField';
import AppHeader from '@src/components/organisms/AppHeader';
import PageContainer from '@src/components/templates/PageContainer';
import { Controller } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {
  ButtonsSection,
  DividerContainer,
  DividerLine,
  DividerText,
  DividerTextWrapper,
  EmailSection,
  ErrorMessage,
  FieldGroup,
  FieldsWrapper,
  ForgotPassword,
  SignContainer,
  SignForm,
  SignTitle,
  SocialSection,
} from '../style';
import { useSignIn } from './useSignIn';

export function SignInPage() {
  const navigate = useNavigate();
  const { control, errors, onSubmit, submitError, isLoading, handleGoogleLogin } = useSignIn();

  return (
    <PageContainer>
      <AppHeader />
      <SignContainer>
        <SignTitle>로그인</SignTitle>
        <SignForm onSubmit={onSubmit}>
          <SocialSection>
            <AppButton
              appVariant="social"
              type="button"
              startIcon={<img src={GoogleIcon} alt="" />}
              onClick={handleGoogleLogin}
            >
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
              <FieldGroup>
                <Controller
                  name="email"
                  control={control}
                  render={({ field: { ref, ...field } }) => (
                    <AppTextField
                      type="email"
                      placeholder="이메일"
                      ref={ref}
                      error={!!errors.email}
                      success={!errors.email && !!field.value}
                      {...field}
                    />
                  )}
                />
                {errors.email && (
                  <AppFieldMessage type="error">{errors.email.message}</AppFieldMessage>
                )}
              </FieldGroup>
              <FieldGroup>
                <Controller
                  name="password"
                  control={control}
                  render={({ field: { ref, ...field } }) => (
                    <AppTextField
                      type="password"
                      placeholder="비밀번호"
                      ref={ref}
                      error={!!errors.password}
                      {...field}
                    />
                  )}
                />
                {errors.password && (
                  <AppFieldMessage type="error">{errors.password.message}</AppFieldMessage>
                )}
              </FieldGroup>
            </FieldsWrapper>
            <ForgotPassword type="button">비밀번호를 잊어버렸나요?</ForgotPassword>
          </EmailSection>
          <ButtonsSection>
            {submitError && <ErrorMessage>{submitError}</ErrorMessage>}
            <AppButton type="submit" appVariant="filled" loading={isLoading}>
              로그인
            </AppButton>
            <AppButton type="button" appVariant="outlined" onClick={() => navigate('/sign-up')}>
              회원가입
            </AppButton>
          </ButtonsSection>
        </SignForm>
      </SignContainer>
    </PageContainer>
  );
}

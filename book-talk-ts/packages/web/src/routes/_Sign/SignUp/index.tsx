import { InputAdornment, Typography } from '@mui/material';
import GoogleIcon from '@src/assets/sign/google-icon.svg';
import { AppButton } from '@src/components/molecules/AppButton';
import { AppFieldMessage } from '@src/components/molecules/AppFieldMessage';
import { AppTextField } from '@src/components/molecules/AppTextField';
import AppHeader from '@src/components/organisms/AppHeader';
import PageContainer from '@src/components/templates/PageContainer';
import { Controller } from 'react-hook-form';
import {
  ButtonsSection,
  DescriptionText,
  DividerContainer,
  DividerLine,
  DividerText,
  DividerTextWrapper,
  EmailSection,
  ErrorMessage,
  FieldGroup,
  FieldsSection,
  FieldsWrapper,
  InlineFieldRow,
  SignContainer,
  SignForm,
  SignTitle,
  SignTitleRow,
  SocialSection,
  UrlLink,
} from '../style';
import { formatCountdown, useSignUp } from './useSignUp';

export function SignUpPage() {
  const {
    control,
    errors,
    onSubmit,
    submitError,
    isLoading,
    emailVerifiedStatus,
    emailCodeSuccess,
    countdown,
    showCountdown,
    handleSendCode,
    handleVerifyCode,
    handleGoogleLogin,
  } = useSignUp();

  return (
    <PageContainer>
      <AppHeader />
      <SignContainer>
        <SignTitleRow>
          <SignTitle>회원가입</SignTitle>
          <DescriptionText>
            이미 계정이 있으신가요? <UrlLink to="/sign-in">로그인</UrlLink>
          </DescriptionText>
        </SignTitleRow>
        <SignForm onSubmit={onSubmit}>
          <SocialSection>
            <AppButton
              appVariant="social"
              type="button"
              startIcon={<img src={GoogleIcon} alt="" />}
              onClick={handleGoogleLogin}
            >
              구글계정으로 빠르게 회원가입하기
            </AppButton>
            <DividerContainer>
              <DividerLine />
              <DividerTextWrapper>
                <DividerText>Or sign up with email</DividerText>
              </DividerTextWrapper>
            </DividerContainer>
          </SocialSection>
          <EmailSection>
            <FieldsWrapper>
              <FieldsSection>
                <FieldGroup>
                  <InlineFieldRow>
                    <Controller
                      name="email"
                      control={control}
                      render={({ field: { ref, ...field } }) => (
                        <AppTextField
                          type="email"
                          placeholder="이메일"
                          ref={ref}
                          style={{ flex: 1 }}
                          error={!!errors.email}
                          success={emailVerifiedStatus !== 'IDLE' && !errors.email}
                          {...field}
                        />
                      )}
                    />
                    <AppButton
                      appVariant="inline"
                      type="button"
                      onClick={handleSendCode}
                      disabled={emailVerifiedStatus === 'SENDING'}
                    >
                      {emailVerifiedStatus === 'SENDING'
                        ? '전송 중'
                        : emailVerifiedStatus === 'IDLE'
                          ? '코드 전송'
                          : '재전송'}
                    </AppButton>
                  </InlineFieldRow>
                  {errors.email && (
                    <AppFieldMessage type="error">{errors.email.message}</AppFieldMessage>
                  )}
                </FieldGroup>

                <FieldGroup>
                  <InlineFieldRow>
                    <Controller
                      name="emailCode"
                      control={control}
                      render={({ field: { ref, ...field } }) => (
                        <AppTextField
                          placeholder="이메일 검증 코드"
                          ref={ref}
                          style={{ flex: 1 }}
                          disabled={
                            emailVerifiedStatus === 'IDLE' ||
                            emailVerifiedStatus === 'SENDING' ||
                            emailVerifiedStatus === 'VERIFIED'
                          }
                          error={!!errors.emailCode}
                          success={!!emailCodeSuccess && !errors.emailCode}
                          slotProps={{
                            input: {
                              endAdornment: showCountdown ? (
                                <InputAdornment position="end">
                                  <Typography
                                    sx={{
                                      fontFamily: 'S-Core Dream',
                                      fontSize: 12,
                                      fontWeight: 400,
                                      whiteSpace: 'nowrap',
                                    }}
                                  >
                                    {formatCountdown(countdown)}
                                  </Typography>
                                </InputAdornment>
                              ) : undefined,
                            },
                          }}
                          {...field}
                        />
                      )}
                    />
                    <AppButton
                      appVariant="inline"
                      type="button"
                      onClick={handleVerifyCode}
                      disabled={emailVerifiedStatus !== 'SENT'}
                    >
                      {emailVerifiedStatus === 'VERIFIED'
                        ? '완료'
                        : emailVerifiedStatus === 'VERIFYING'
                          ? '확인 중'
                          : '확인'}
                    </AppButton>
                  </InlineFieldRow>
                  {errors.emailCode && (
                    <AppFieldMessage type="error">{errors.emailCode.message}</AppFieldMessage>
                  )}
                  {!errors.emailCode && emailCodeSuccess && (
                    <AppFieldMessage type="success">{emailCodeSuccess}</AppFieldMessage>
                  )}
                </FieldGroup>
              </FieldsSection>

              <FieldsSection>
                <FieldGroup>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field: { ref, ...field } }) => (
                      <AppTextField
                        placeholder="닉네임 (최대 10자)"
                        ref={ref}
                        error={!!errors.name}
                        {...field}
                      />
                    )}
                  />
                  {errors.name && (
                    <AppFieldMessage type="error">{errors.name.message}</AppFieldMessage>
                  )}
                </FieldGroup>
              </FieldsSection>

              <FieldsSection>
                <FieldGroup>
                  <Controller
                    name="password"
                    control={control}
                    render={({ field: { ref, ...field } }) => (
                      <AppTextField
                        type="password"
                        placeholder="비밀번호 (8자 이상, 영문, 숫자, 특수 문자)"
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

                <FieldGroup>
                  <Controller
                    name="passwordConfirm"
                    control={control}
                    render={({ field: { ref, ...field } }) => (
                      <AppTextField
                        type="password"
                        placeholder="비밀번호 확인"
                        ref={ref}
                        error={!!errors.passwordConfirm}
                        {...field}
                      />
                    )}
                  />
                  {errors.passwordConfirm && (
                    <AppFieldMessage type="error">{errors.passwordConfirm.message}</AppFieldMessage>
                  )}
                </FieldGroup>
              </FieldsSection>
            </FieldsWrapper>
            <DescriptionText>
              <UrlLink to="/terms-of-use">서비스이용약관</UrlLink>과{' '}
              <UrlLink to="/privacy">개인정보처리방침</UrlLink>에 동의합니다
            </DescriptionText>
          </EmailSection>
          <ButtonsSection>
            {submitError && <ErrorMessage>{submitError}</ErrorMessage>}
            <AppButton type="submit" appVariant="filled" loading={isLoading}>
              계정 만들기
            </AppButton>
          </ButtonsSection>
        </SignForm>
      </SignContainer>
    </PageContainer>
  );
}

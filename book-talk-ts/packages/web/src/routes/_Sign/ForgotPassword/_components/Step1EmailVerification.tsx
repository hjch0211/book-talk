import { InputAdornment, Typography } from '@mui/material';
import { AppButton } from '@src/components/molecules/AppButton';
import { AppFieldMessage } from '@src/components/molecules/AppFieldMessage';
import { AppTextField } from '@src/components/molecules/AppTextField';
import { Controller } from 'react-hook-form';
import {
  ButtonsSection,
  FieldGroup,
  FieldsSection,
  InlineFieldRow,
  SignForm,
  SignTitle,
} from '../../style';
import { SubTitle, TitleSection } from '../style';
import type { useForgotPassword } from '../useForgotPassword';
import { formatCountdown } from '../useForgotPassword';

interface Props {
  step1: ReturnType<typeof useForgotPassword>['step1'];
}

export function Step1EmailVerification({ step1 }: Props) {
  return (
    <>
      <TitleSection>
        <SignTitle>비밀번호 변경</SignTitle>
        <SubTitle>비밀번호 변경을 위해 이메일을 인증해주세요</SubTitle>
      </TitleSection>

      <SignForm onSubmit={step1.onSubmit}>
        <FieldsSection>
          <FieldGroup>
            <InlineFieldRow>
              <Controller
                name="email"
                control={step1.control}
                render={({ field: { ref, ...field } }) => (
                  <AppTextField
                    type="email"
                    placeholder="이메일"
                    ref={ref}
                    style={{ flex: 1 }}
                    error={!!step1.errors.email}
                    success={step1.emailVerifiedStatus !== 'IDLE' && !step1.errors.email}
                    {...field}
                  />
                )}
              />
              <AppButton
                appVariant="inline"
                type="button"
                onClick={step1.handleSendCode}
                disabled={step1.emailVerifiedStatus === 'SENDING'}
              >
                {step1.emailVerifiedStatus === 'SENDING'
                  ? '전송 중'
                  : step1.emailVerifiedStatus === 'IDLE'
                    ? '코드 전송'
                    : '재전송'}
              </AppButton>
            </InlineFieldRow>
            {step1.errors.email && (
              <AppFieldMessage type="error">{step1.errors.email.message}</AppFieldMessage>
            )}
          </FieldGroup>

          <FieldGroup>
            <Controller
              name="emailCode"
              control={step1.control}
              render={({ field: { ref, ...field } }) => (
                <AppTextField
                  placeholder="이메일 검증 코드"
                  ref={ref}
                  disabled={
                    step1.emailVerifiedStatus === 'IDLE' ||
                    step1.emailVerifiedStatus === 'SENDING' ||
                    step1.emailVerifiedStatus === 'VERIFIED'
                  }
                  error={!!step1.errors.emailCode}
                  success={step1.emailVerifiedStatus === 'VERIFIED'}
                  slotProps={{
                    input: {
                      endAdornment: step1.showCountdown ? (
                        <InputAdornment position="end">
                          <Typography
                            sx={{
                              fontFamily: 'S-Core Dream',
                              fontSize: 12,
                              fontWeight: 400,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {formatCountdown(step1.countdown)}
                          </Typography>
                        </InputAdornment>
                      ) : undefined,
                    },
                  }}
                  {...field}
                />
              )}
            />
            {step1.errors.emailCode && (
              <AppFieldMessage type="error">{step1.errors.emailCode.message}</AppFieldMessage>
            )}
            {step1.emailVerifiedStatus === 'VERIFIED' && !step1.errors.emailCode && (
              <AppFieldMessage type="success">이메일이 확인되었습니다.</AppFieldMessage>
            )}
          </FieldGroup>
        </FieldsSection>

        <ButtonsSection>
          <AppButton
            type="submit"
            appVariant="filled"
            loading={step1.emailVerifiedStatus === 'VERIFYING'}
          >
            확인
          </AppButton>
        </ButtonsSection>
      </SignForm>
    </>
  );
}

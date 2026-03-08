import { AppButton } from '@src/components/molecules/AppButton';
import { AppFieldMessage } from '@src/components/molecules/AppFieldMessage';
import { AppTextField } from '@src/components/molecules/AppTextField';
import { Controller } from 'react-hook-form';
import { ButtonsSection, FieldGroup, FieldsSection, SignForm, SignTitle } from '../../style';
import { SubTitle, TitleSection } from '../style';
import type { useForgotPassword } from '../useForgotPassword';

interface Props {
  step2: ReturnType<typeof useForgotPassword>['step2'];
}

export function Step2ResetPassword({ step2 }: Props) {
  return (
    <>
      <TitleSection>
        <SignTitle>비밀번호 변경</SignTitle>
        <SubTitle>보안을 위해 이전과 다른 비밀번호로 설정해주세요</SubTitle>
      </TitleSection>

      <SignForm onSubmit={step2.onSubmit}>
        <FieldsSection>
          <FieldGroup>
            <Controller
              name="newPassword"
              control={step2.control}
              render={({ field: { ref, ...field } }) => (
                <AppTextField
                  type="password"
                  placeholder="새 비밀번호 (8자 이상, 영문, 숫자, 특수 문자)"
                  ref={ref}
                  error={!!step2.errors.newPassword}
                  {...field}
                />
              )}
            />
            {step2.errors.newPassword && (
              <AppFieldMessage type="error">{step2.errors.newPassword.message}</AppFieldMessage>
            )}
          </FieldGroup>

          <FieldGroup>
            <Controller
              name="newPasswordConfirm"
              control={step2.control}
              render={({ field: { ref, ...field } }) => (
                <AppTextField
                  type="password"
                  placeholder="비밀번호 확인"
                  ref={ref}
                  error={!!step2.errors.newPasswordConfirm}
                  {...field}
                />
              )}
            />
            {step2.errors.newPasswordConfirm && (
              <AppFieldMessage type="error">
                {step2.errors.newPasswordConfirm.message}
              </AppFieldMessage>
            )}
          </FieldGroup>
        </FieldsSection>

        <ButtonsSection>
          <AppButton type="submit" appVariant="filled" loading={step2.isPending}>
            비밀번호 변경하기
          </AppButton>
        </ButtonsSection>
      </SignForm>
    </>
  );
}

import { AppButton } from '@src/components/molecules/AppButton';
import { AppFieldMessage } from '@src/components/molecules/AppFieldMessage';
import { AppTextField } from '@src/components/molecules/AppTextField';
import type { FormEventHandler } from 'react';
import type { Control, FieldErrors } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import {
  FieldGroup,
  FieldLabel,
  FieldsWrapper,
  FormContainer,
  NewPasswordGroup,
} from '../../style.ts';
import type { PasswordChangeFormValues } from '../../useMyInfoModificationSection.ts';

interface Props {
  control: Control<PasswordChangeFormValues>;
  errors: FieldErrors<PasswordChangeFormValues>;
  onSubmit: FormEventHandler<HTMLFormElement>;
  isPending: boolean;
}

export function PasswordChangeForm({ control, errors, onSubmit, isPending }: Props) {
  return (
    <FormContainer onSubmit={onSubmit} style={{ height: '720px' }}>
      <FieldsWrapper>
        <FieldGroup>
          <FieldLabel>현재 비밀번호</FieldLabel>
          <Controller
            name="currentPassword"
            control={control}
            render={({ field: { ref, ...field } }) => (
              <AppTextField type="password" ref={ref} error={!!errors.currentPassword} {...field} />
            )}
          />
          {errors.currentPassword && (
            <AppFieldMessage type="error">{errors.currentPassword.message}</AppFieldMessage>
          )}
        </FieldGroup>
        <NewPasswordGroup>
          <FieldGroup>
            <FieldLabel>새로운 비밀번호</FieldLabel>
            <Controller
              name="newPassword"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <AppTextField type="password" ref={ref} error={!!errors.newPassword} {...field} />
              )}
            />
            {errors.newPassword && (
              <AppFieldMessage type="error">{errors.newPassword.message}</AppFieldMessage>
            )}
          </FieldGroup>
          <FieldGroup>
            <FieldLabel>새로운 비밀번호 확인</FieldLabel>
            <Controller
              name="newPasswordConfirm"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <AppTextField
                  type="password"
                  ref={ref}
                  error={!!errors.newPasswordConfirm}
                  {...field}
                />
              )}
            />
            {errors.newPasswordConfirm && (
              <AppFieldMessage type="error">{errors.newPasswordConfirm.message}</AppFieldMessage>
            )}
          </FieldGroup>
        </NewPasswordGroup>
      </FieldsWrapper>
      <AppButton appVariant="filled" type="submit" disabled={isPending}>
        비밀번호 변경
      </AppButton>
    </FormContainer>
  );
}

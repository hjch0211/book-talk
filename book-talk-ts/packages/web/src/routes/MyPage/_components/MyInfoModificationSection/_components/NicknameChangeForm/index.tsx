import { AppButton } from '@src/components/molecules/AppButton';
import { AppFieldMessage } from '@src/components/molecules/AppFieldMessage';
import { AppTextField } from '@src/components/molecules/AppTextField';
import type { FormEventHandler } from 'react';
import type { Control, FieldErrors } from 'react-hook-form';
import { Controller } from 'react-hook-form';
import { ButtonRow, FormContainer, InputsWrapper } from '../../style.ts';

interface Props {
  control: Control<{ name: string }>;
  errors: FieldErrors<{ name: string }>;
  onSubmit: FormEventHandler<HTMLFormElement>;
  isPending: boolean;
}

export function NicknameChangeForm({ control, errors, onSubmit, isPending }: Props) {
  return (
    <FormContainer onSubmit={onSubmit} style={{ height: '720px' }}>
      <InputsWrapper>
        <Controller
          name="name"
          control={control}
          render={({ field: { ref, ...field } }) => (
            <AppTextField placeholder="새 닉네임" ref={ref} error={!!errors.name} {...field} />
          )}
        />
        {errors.name && <AppFieldMessage type="error">{errors.name.message}</AppFieldMessage>}
      </InputsWrapper>
      <ButtonRow>
        <AppButton
          appVariant="filled"
          fullWidth={false}
          type="submit"
          style={{ width: 120, height: 44, borderRadius: 10 }}
          disabled={isPending}
        >
          저장
        </AppButton>
      </ButtonRow>
    </FormContainer>
  );
}

import { AppButton } from '@src/components/molecules/AppButton';
import { AppFieldMessage } from '@src/components/molecules/AppFieldMessage';
import { AppTextField } from '@src/components/molecules/AppTextField';
import Modal from '@src/components/organisms/Modal';
import { Controller, useForm } from 'react-hook-form';
import { ContentGroup, FieldGroup, ModalContainer, ModalTitle } from './style.ts';

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (password: string) => void;
  isPending: boolean;
}

export function PasswordVerificationModal({ open, onClose, onConfirm, isPending }: Props) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<{ password: string }>({
    defaultValues: { password: '' },
  });

  const onSubmit = handleSubmit(({ password }) => onConfirm(password));

  return (
    <Modal open={open} onClose={onClose} width={474} inner>
      <ModalContainer>
        <ContentGroup>
          <FieldGroup>
            <ModalTitle>회원 인증을 위해 비밀번호를 입력해주세요</ModalTitle>
            <Controller
              name="password"
              control={control}
              rules={{ required: '비밀번호를 입력해주세요' }}
              render={({ field: { ref, ...field } }) => (
                <AppTextField
                  type="password"
                  ref={ref}
                  error={!!errors.password}
                  style={{ width: 354, height: 52, borderRadius: 12 }}
                  {...field}
                />
              )}
            />
            {errors.password && (
              <AppFieldMessage type="error">{errors.password.message}</AppFieldMessage>
            )}
          </FieldGroup>
          <AppButton
            appVariant="filled"
            fullWidth={false}
            type="button"
            style={{ width: 117, height: 50, borderRadius: 10 }}
            disabled={isPending}
            onClick={onSubmit}
          >
            확인
          </AppButton>
        </ContentGroup>
      </ModalContainer>
    </Modal>
  );
}

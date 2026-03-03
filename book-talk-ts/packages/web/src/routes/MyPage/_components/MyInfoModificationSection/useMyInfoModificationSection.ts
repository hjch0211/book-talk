import { zodResolver } from '@hookform/resolvers/zod';
import {
  deleteMyAccount,
  meQueryOption,
  PatchMyPasswordRequestSchema,
  PatchMyRequestSchema,
  patchMyAccount,
  patchMyPassword,
} from '@src/externals/account';
import { verifyPassword } from '@src/externals/auth';
import { clearTokens } from '@src/externals/client';
import { useToast } from '@src/hooks';
import { useInnerModal } from '@src/hooks/infra/useInnerModal';
import { DeleteAccountModal } from '@src/routes/MyPage/_components/DeleteAccountModal';
import { PasswordVerificationModal } from '@src/routes/MyPage/_components/PasswordVerificationModal';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

const PasswordChangeFormSchema = PatchMyPasswordRequestSchema.extend({
  newPasswordConfirm: z.string().min(1, '비밀번호 확인을 입력해주세요'),
}).refine((data) => data.newPassword === data.newPasswordConfirm, {
  message: '새 비밀번호가 일치하지 않습니다.',
  path: ['newPasswordConfirm'],
});

export type PasswordChangeFormValues = z.infer<typeof PasswordChangeFormSchema>;
export type ProfileChip = 'nickname' | 'password' | 'withdrawal';

export function useMyInfoModificationSection() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { openModal, closeModal } = useInnerModal();
  const { data: me } = useQuery(meQueryOption);
  const [chip, setChip] = useState<ProfileChip>('nickname');

  // 닉네임 변경 폼
  const nicknameForm = useForm<{ name: string }>({
    resolver: zodResolver(PatchMyRequestSchema),
    defaultValues: { name: me?.name ?? '' },
  });

  const nicknameMutation = useMutation({
    mutationFn: patchMyAccount,
    onSuccess: () => {
      toast.success('닉네임이 변경되었습니다.');
      void queryClient.invalidateQueries();
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : '닉네임 변경 중 오류가 발생했습니다.');
    },
  });

  const onNicknameSubmit = nicknameForm.handleSubmit((data) => nicknameMutation.mutate(data));

  // 비밀번호 변경 폼
  const passwordForm = useForm<PasswordChangeFormValues>({
    resolver: zodResolver(PasswordChangeFormSchema),
    defaultValues: { currentPassword: '', newPassword: '', newPasswordConfirm: '' },
  });

  const passwordMutation = useMutation({
    mutationFn: ({ currentPassword, newPassword }: PasswordChangeFormValues) =>
      patchMyPassword({ currentPassword, newPassword }),
    onSuccess: () => {
      toast.success('비밀번호가 변경되었습니다.');
      passwordForm.reset();
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : '비밀번호 변경 중 오류가 발생했습니다.');
    },
  });

  const onPasswordSubmit = passwordForm.handleSubmit((data) => passwordMutation.mutate(data));

  // 비밀번호 검증 → withdrawal 화면으로 전환
  const verifyPasswordMutation = useMutation({
    mutationFn: verifyPassword,
    onSuccess: () => {
      closeModal();
      setChip('withdrawal');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : '비밀번호 인증에 실패했습니다.');
    },
  });

  // 회원 탈퇴
  const deleteAccountMutation = useMutation({
    mutationFn: deleteMyAccount,
    onSuccess: () => {
      clearTokens();
      queryClient.clear();
      toast.success('회원 탈퇴가 완료되었습니다.');
      navigate('/sign-in');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : '회원 탈퇴 중 오류가 발생했습니다.');
    },
  });

  const onDeleteClick = () =>
    openModal(DeleteAccountModal, {
      onConfirm: () =>
        openModal(PasswordVerificationModal, {
          onConfirm: (password: string) => verifyPasswordMutation.mutate(password),
          isPending: verifyPasswordMutation.isPending,
        }),
      isPending: false,
    });

  return {
    chip,
    setChip,
    nicknameForm: {
      control: nicknameForm.control,
      errors: nicknameForm.formState.errors,
      onSubmit: onNicknameSubmit,
      isPending: nicknameMutation.isPending,
    },
    passwordForm: {
      control: passwordForm.control,
      errors: passwordForm.formState.errors,
      onSubmit: onPasswordSubmit,
      isPending: passwordMutation.isPending,
    },
    deleteAccount: { onDeleteClick },
    withdrawal: {
      onCancel: () => setChip('nickname'),
      onConfirm: () => deleteAccountMutation.mutate(),
      isPending: deleteAccountMutation.isPending,
    },
  };
}

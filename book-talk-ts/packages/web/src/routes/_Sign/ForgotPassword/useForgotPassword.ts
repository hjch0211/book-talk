import { zodResolver } from '@hookform/resolvers/zod';
import {
  ForgotPasswordStep1FormSchema,
  type ForgotPasswordStep1FormValues,
  ForgotPasswordStep2FormSchema,
  type ForgotPasswordStep2FormValues,
  resetPassword,
  sendPasswordResetOtp,
  verifyPasswordResetOtp,
} from '@src/externals/auth';
import { useToast } from '@src/hooks';
import { useCountdown } from '@src/hooks/infra/useCountdown';
import { useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

export type EmailVerifiedStatus = 'IDLE' | 'SENDING' | 'SENT' | 'VERIFYING' | 'VERIFIED';

export const formatCountdown = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

export function useForgotPassword() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [emailVerifiedStatus, setEmailVerifiedStatus] = useState<EmailVerifiedStatus>('IDLE');
  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null);
  const { countdown, start: startCountdown, stop: stopCountdown } = useCountdown(299);

  // Step 1 form
  const step1Form = useForm<ForgotPasswordStep1FormValues>({
    resolver: zodResolver(ForgotPasswordStep1FormSchema),
    defaultValues: { email: '', emailCode: '' },
  });

  // Step 2 form
  const step2Form = useForm<ForgotPasswordStep2FormValues>({
    resolver: zodResolver(ForgotPasswordStep2FormSchema),
    defaultValues: { newPassword: '', newPasswordConfirm: '' },
  });

  const handleSendCode = async () => {
    const isValid = await step1Form.trigger('email');
    if (!isValid) return;
    const email = step1Form.getValues('email');
    setVerifiedEmail(null);
    setEmailVerifiedStatus('SENDING');
    try {
      await sendPasswordResetOtp({ email });
      setEmailVerifiedStatus('SENT');
      startCountdown();
      toast.success('검증 코드가 전송되었습니다.');
    } catch {
      setEmailVerifiedStatus('IDLE');
      step1Form.setError('email', { message: '인증 코드 발송 중 오류가 발생했습니다.' });
    }
  };

  const onStep1Submit = step1Form.handleSubmit(async (data) => {
    if (emailVerifiedStatus === 'IDLE' || emailVerifiedStatus === 'SENDING') {
      step1Form.setError('email', { message: '이메일 인증 코드를 전송해주세요.' });
      return;
    }
    setEmailVerifiedStatus('VERIFYING');
    try {
      await verifyPasswordResetOtp({ email: data.email, code: data.emailCode });
      stopCountdown();
      setEmailVerifiedStatus('VERIFIED');
      setVerifiedEmail(data.email);
    } catch (error) {
      setEmailVerifiedStatus('SENT');
      step1Form.setError('emailCode', {
        message: error instanceof Error ? error.message : '인증 코드 확인 중 오류가 발생했습니다.',
      });
    }
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (newPassword: string) => resetPassword({ email: verifiedEmail!, newPassword }),
    onSuccess: () => {
      toast.success('비밀번호가 변경되었습니다.');
      navigate('/sign-in');
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : '비밀번호 변경 중 오류가 발생했습니다.');
    },
  });

  const onStep2Submit = step2Form.handleSubmit((data) => {
    resetPasswordMutation.mutate(data.newPassword);
  });

  const showCountdown =
    (emailVerifiedStatus === 'SENT' || emailVerifiedStatus === 'VERIFYING') && countdown > 0;

  return {
    verifiedEmail,
    // Step 1
    step1: {
      control: step1Form.control,
      errors: step1Form.formState.errors,
      emailVerifiedStatus,
      countdown,
      showCountdown,
      handleSendCode,
      onSubmit: onStep1Submit,
    },
    // Step 2
    step2: {
      control: step2Form.control,
      errors: step2Form.formState.errors,
      onSubmit: onStep2Submit,
      isPending: resetPasswordMutation.isPending,
    },
  };
}

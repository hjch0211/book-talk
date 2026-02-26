import { zodResolver } from '@hookform/resolvers/zod';
import { meQueryOption } from '@src/externals/account';
import {
  googleLogin,
  SignUpRequestSchema,
  sendEmailCode,
  signUp,
  verifyEmailCode,
} from '@src/externals/auth';
import { saveTokens } from '@src/externals/client';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

export type EmailVerifiedStatus = 'IDLE' | 'SENDING' | 'SENT' | 'VERIFYING' | 'VERIFIED';

const COUNTDOWN_SECONDS = 299;

export const formatCountdown = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

const extractError = (error: unknown, fallback: string): string => {
  if (error instanceof Error) return error.message;
  return fallback;
};

const SignUpFormSchema = SignUpRequestSchema.extend({
  emailCode: z.string(),
  passwordConfirm: z.string(),
}).refine((data) => data.password === data.passwordConfirm, {
  message: '비밀번호가 일치하지 않습니다.',
  path: ['passwordConfirm'],
});

type SignUpFormValues = z.infer<typeof SignUpFormSchema>;

export function useSignUp() {
  const navigate = useNavigate();
  const { data: me } = useQuery(meQueryOption);
  const [emailVerifiedStatus, setEmailVerifiedStatus] = useState<EmailVerifiedStatus>('IDLE');
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [emailSuccess, setEmailSuccess] = useState<string | null>(null);
  const [emailCodeSuccess, setEmailCodeSuccess] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    setError,
    getValues,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: { email: '', emailCode: '', name: '', password: '', passwordConfirm: '' },
  });

  useEffect(() => {
    if (me) navigate('/');
  }, [me, navigate]);

  useEffect(() => {
    if (emailVerifiedStatus === 'SENT') {
      setCountdown(COUNTDOWN_SECONDS);
    } else if (emailVerifiedStatus === 'VERIFIED' || emailVerifiedStatus === 'IDLE') {
      setCountdown(null);
    }
  }, [emailVerifiedStatus]);

  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      setEmailVerifiedStatus('IDLE');
      setError('emailCode', { message: '인증 시간이 만료되었습니다. 다시 시도해주세요.' });
      setCountdown(null);
      return;
    }
    const timer = setTimeout(() => setCountdown((prev) => (prev !== null ? prev - 1 : null)), 1000);
    return () => clearTimeout(timer);
  }, [countdown, setError]);

  const handleSendCode = async () => {
    const email = getValues('email');
    setEmailSuccess(null);
    if (!email) {
      setError('email', { message: '이메일을 입력해주세요.' });
      return;
    }
    setEmailVerifiedStatus('SENDING');
    try {
      await sendEmailCode({ email });
      setEmailVerifiedStatus('SENT');
      setEmailSuccess('인증 코드가 발송되었습니다.');
    } catch (error) {
      setEmailVerifiedStatus('IDLE');
      setError('email', { message: extractError(error, '인증 코드 발송 중 오류가 발생했습니다.') });
    }
  };

  const handleVerifyCode = async () => {
    const { email, emailCode } = getValues();
    setEmailCodeSuccess(null);
    setEmailVerifiedStatus('VERIFYING');
    try {
      await verifyEmailCode({ email, code: emailCode });
      setEmailVerifiedStatus('VERIFIED');
      setEmailCodeSuccess('이메일이 확인되었습니다.');
    } catch (error) {
      setEmailVerifiedStatus('SENT');
      setError('emailCode', {
        message: extractError(error, '인증 코드 확인 중 오류가 발생했습니다.'),
      });
    }
  };

  const submitHandler: SubmitHandler<SignUpFormValues> = async (data) => {
    setSubmitError(null);
    if (emailVerifiedStatus !== 'VERIFIED') {
      setError('emailCode', { message: '이메일 인증을 완료해주세요.' });
      return;
    }
    setIsLoading(true);
    try {
      const tokens = await signUp({ email: data.email, name: data.name, password: data.password });
      saveTokens(tokens.accessToken, tokens.refreshToken);
      navigate('/home');
    } catch (error) {
      setSubmitError(extractError(error, '회원가입 중 오류가 발생했습니다.'));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    control,
    errors,
    onSubmit: handleSubmit(submitHandler),
    submitError,
    isLoading,
    emailVerifiedStatus,
    countdown,
    emailSuccess,
    emailCodeSuccess,
    handleSendCode,
    handleVerifyCode,
    handleGoogleLogin: googleLogin,
  };
}

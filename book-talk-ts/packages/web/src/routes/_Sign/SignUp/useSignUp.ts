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
import { useToast } from '@src/hooks/infra/useToast';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

export type EmailVerifiedStatus = 'IDLE' | 'SENDING' | 'SENT' | 'VERIFYING' | 'VERIFIED';

export const formatCountdown = (seconds: number) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

const SignUpFormSchema = SignUpRequestSchema.extend({
  emailCode: z.string().length(6, '인증 코드는 6자리입니다'),
  passwordConfirm: z.string(),
}).refine((data) => data.password === data.passwordConfirm, {
  message: '비밀번호가 일치하지 않습니다.',
  path: ['passwordConfirm'],
});

type SignUpFormValues = z.infer<typeof SignUpFormSchema>;

export function useSignUp() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: me } = useQuery(meQueryOption);
  const [emailVerifiedStatus, setEmailVerifiedStatus] = useState<EmailVerifiedStatus>('IDLE');
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [emailCodeSuccess, setEmailCodeSuccess] = useState<string | null>(null);
  const [verifiedEmail, setVerifiedEmail] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(299);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startCountdown = () => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    setCountdown(299);
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  const {
    control,
    handleSubmit,
    setError,
    getValues,
    trigger,
    formState: { errors },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(SignUpFormSchema),
    defaultValues: { email: '', emailCode: '', name: '', password: '', passwordConfirm: '' },
  });

  useEffect(() => {
    if (me) navigate('/home');
  }, [me, navigate]);

  const handleSendCode = async () => {
    const isValid = await trigger('email');
    if (!isValid) return;
    const email = getValues('email');
    setVerifiedEmail(null);
    setEmailVerifiedStatus('SENDING');
    try {
      await sendEmailCode({ email });
      setEmailVerifiedStatus('SENT');
      startCountdown();
      toast.success('검증 코드가 전송되었습니다.');
    } catch {
      setEmailVerifiedStatus('IDLE');
      setError('email', { message: '인증 코드 발송 중 오류가 발생했습니다.' });
    }
  };

  const handleVerifyCode = async () => {
    const isValid = await trigger('emailCode');
    if (!isValid) return;
    const { email, emailCode } = getValues();
    setEmailCodeSuccess(null);
    setEmailVerifiedStatus('VERIFYING');
    try {
      await verifyEmailCode({ email, code: emailCode });
      if (countdownRef.current) clearInterval(countdownRef.current);
      setEmailVerifiedStatus('VERIFIED');
      setVerifiedEmail(email);
      setEmailCodeSuccess('이메일이 확인되었습니다.');
    } catch (error) {
      setEmailVerifiedStatus('SENT');
      setError('emailCode', {
        message: error instanceof Error ? error.message : '인증 코드 확인 중 오류가 발생했습니다.',
      });
    }
  };

  const submitHandler: SubmitHandler<SignUpFormValues> = async (data) => {
    setSubmitError(null);
    if (emailVerifiedStatus !== 'VERIFIED' || data.email !== verifiedEmail) {
      setError('emailCode', { message: '이메일 인증을 완료해주세요.' });
      return;
    }
    setIsLoading(true);
    try {
      const tokens = await signUp({ email: data.email, name: data.name, password: data.password });
      saveTokens(tokens.accessToken, tokens.refreshToken);
      navigate('/home');
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : '회원가입 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const showCountdown =
    (emailVerifiedStatus === 'SENT' || emailVerifiedStatus === 'VERIFYING') && countdown > 0;

  return {
    control,
    errors,
    onSubmit: handleSubmit(submitHandler),
    submitError,
    isLoading,
    emailVerifiedStatus,
    emailCodeSuccess,
    countdown,
    showCountdown,
    handleSendCode,
    handleVerifyCode,
    handleGoogleLogin: googleLogin,
  };
}

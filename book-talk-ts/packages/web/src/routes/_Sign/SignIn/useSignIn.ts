import { zodResolver } from '@hookform/resolvers/zod';
import { meQueryOption } from '@src/externals/account';
import { googleLogin, SignInRequestSchema, signIn } from '@src/externals/auth';
import { saveTokens } from '@src/externals/client';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import type { z } from 'zod';

type SignInFormValues = z.infer<typeof SignInRequestSchema>;

const extractError = (error: unknown, fallback: string): string => {
  if (error instanceof Error) return error.message;
  return fallback;
};

export function useSignIn() {
  const navigate = useNavigate();
  const { data: me } = useQuery(meQueryOption);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (me) navigate('/');
  }, [me, navigate]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(SignInRequestSchema),
    defaultValues: { email: '', password: '' },
  });

  const submitHandler: SubmitHandler<SignInFormValues> = async (data) => {
    setSubmitError(null);
    setIsLoading(true);
    try {
      const tokens = await signIn(data);
      saveTokens(tokens.accessToken, tokens.refreshToken);
      navigate('/home');
    } catch (error) {
      setSubmitError(extractError(error, '로그인 중 오류가 발생했습니다.'));
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
    handleGoogleLogin: googleLogin,
  };
}

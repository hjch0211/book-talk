import { zodResolver } from '@hookform/resolvers/zod';
import { meQueryOption } from '@src/externals/account';
import { googleLogin, SignInRequestSchema, signIn } from '@src/externals/auth';
import { saveTokens } from '@src/externals/client';
import { useToast } from '@src/hooks/infra/useToast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useEffectEvent } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import type { z } from 'zod';

type SignInFormValues = z.infer<typeof SignInRequestSchema>;

export function useSignIn() {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as { redirect?: string })?.redirect ?? '/home';
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: me } = useQuery(meQueryOption);
  const handleRedirectTo = useEffectEvent(() => {
    console.log(redirectTo);
    navigate(redirectTo);
  });

  useEffect(() => {
    if (me) handleRedirectTo();
  }, [me]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>({
    resolver: zodResolver(SignInRequestSchema),
    defaultValues: { email: '', password: '' },
  });

  const signInMutation = useMutation({
    mutationFn: signIn,
    onSuccess: async (tokens) => {
      saveTokens(tokens.accessToken, tokens.refreshToken);
      await queryClient.invalidateQueries();
      const user = await queryClient.fetchQuery(meQueryOption);
      toast.success(`반가워요 ${user?.name}님!`);
      navigate(redirectTo);
    },
  });

  return {
    control,
    errors,
    onSubmit: handleSubmit((data) => signInMutation.mutate(data)),
    submitError:
      signInMutation.error instanceof Error
        ? signInMutation.error.message
        : signInMutation.isError
          ? '로그인 중 오류가 발생했습니다.'
          : null,
    isLoading: signInMutation.isPending,
    handleGoogleLogin: googleLogin,
  };
}

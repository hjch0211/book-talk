import { zodResolver } from '@hookform/resolvers/zod';
import { meQueryOption } from '@src/externals/account';
import { googleLogin, SignInRequestSchema, signIn } from '@src/externals/auth';
import { saveTokens } from '@src/externals/client';
import { useToast } from '@src/hooks/infra/useToast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import type { z } from 'zod';

type SignInFormValues = z.infer<typeof SignInRequestSchema>;

export function useSignIn() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: me } = useQuery(meQueryOption);

  useEffect(() => {
    if (me) navigate('/home');
  }, [me, navigate]);

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
      await queryClient.invalidateQueries({ queryKey: meQueryOption.queryKey });
      const user = await queryClient.fetchQuery(meQueryOption);
      toast.success(`반가워요 ${user?.name}님!`);
      navigate('/home');
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

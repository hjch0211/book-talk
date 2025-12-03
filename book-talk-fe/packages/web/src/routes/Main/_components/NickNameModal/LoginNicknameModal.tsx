import {useMutation, useQueryClient} from '@tanstack/react-query';
import {signIn, signUp} from '../../../../apis/auth';
import {useToast} from '../../../../hooks/infra/useToast.tsx';
import NicknameModal from './NicknameModal';
import type {ApiError} from '../../../../apis/client';

interface LoginNicknameModalProps {
    open: boolean;
    onClose: () => void;
}

const LoginNicknameModal = ({open, onClose}: LoginNicknameModalProps) => {
    const {toast} = useToast();
    const queryClient = useQueryClient();

    const signInMutation = useMutation({
        mutationFn: (name: string) => signIn({name}),
        onSuccess: async (data) => {
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            await queryClient.invalidateQueries();
            onClose();
        },
        onError: (error: ApiError, variables) => {
            if (error?.status === 400 && error?.message === '존재하지 않는 계정입니다.') {
                signUpMutation.mutate(variables);
            } else {
                toast.error('로그인 중 오류가 발생했습니다.');
            }
        }
    });

    const signUpMutation = useMutation({
        mutationFn: (name: string) => signUp({name}),
        onSuccess: async (data) => {
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            await queryClient.invalidateQueries();
            onClose();
        },
    });

    const handleSubmit = (nickname: string) => {
        signInMutation.mutate(nickname);
    };

    const isLoading = signInMutation.isPending || signUpMutation.isPending;

    return (
        <NicknameModal
            open={open}
            onClose={onClose}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            loadingMessage={signUpMutation.isPending ? '새로운 계정을 생성하고 있습니다...' : undefined}
        />
    );
};

export default LoginNicknameModal;

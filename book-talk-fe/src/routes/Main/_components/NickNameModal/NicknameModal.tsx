import {useState} from 'react';
import {CircularProgress} from '@mui/material';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import Modal from '../../../../components/Modal';
import {signIn, signUp} from '../../../../apis/auth';
import {useToast} from '../../../../hooks/useToast';
import {
    ButtonText,
    ConfirmButton,
    ContentWrapper,
    InputWrapper,
    LoadingMessage,
    ModalContainer,
    ModalTitle,
    StyledTextField
} from './NicknameModal.style';
import type {ApiError} from "../../../../apis/client.ts";

interface NicknameModalProps {
    open: boolean;
    onClose: () => void;
}

const NicknameModal = ({open, onClose}: NicknameModalProps) => {
    const [nickname, setNickname] = useState('');
    const {toast} = useToast();
    const queryClient = useQueryClient();

    const signInMutation = useMutation({
        mutationFn: (name: string) => signIn({name}),
        onSuccess: async () => {
            await queryClient.invalidateQueries();
            handleClose();
        },
        onError: (error: ApiError) => {
            if (error?.status === 400 && error?.message === '존재하지 않는 계정입니다.') {
                signUpMutation.mutate(nickname);
            } else {
                toast.error('로그인 중 오류가 발생했습니다.');
            }
        }
    });

    const signUpMutation = useMutation({
        mutationFn: (name: string) => signUp({name}),
        onSuccess: async () => {
            // 회원가입 성공 시에도 동일하게 쿼리 무효화
            await queryClient.invalidateQueries();
            handleClose();
        },
        onError: () => {
            toast.error('회원가입 중 오류가 발생했습니다.');
        }
    });

    const handleSubmit = () => {
        if (nickname.trim()) {
            signInMutation.mutate(nickname);
        }
    };

    const handleClose = () => {
        setNickname('');
        onClose();
    };

    const isLoading = signInMutation.isPending || signUpMutation.isPending;

    return (
        <Modal
            open={open}
            onClose={handleClose}
            width={808}
            height={548}
            showCloseButton={true}
        >
            <ModalContainer>
                <ContentWrapper>
                    <ModalTitle>
                        닉네임을 입력해주세요
                    </ModalTitle>

                    <InputWrapper>
                        <StyledTextField
                            fullWidth
                            variant="outlined"
                            placeholder="닉네임"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !isLoading) {
                                    handleSubmit();
                                }
                            }}
                            disabled={isLoading}
                        />
                        {signUpMutation.isPending && (
                            <LoadingMessage>
                                새로운 계정을 생성하고 있습니다...
                            </LoadingMessage>
                        )}
                    </InputWrapper>
                </ContentWrapper>

                <ConfirmButton
                    onClick={handleSubmit}
                    disabled={!nickname.trim() || isLoading}
                >
                    {isLoading ? (
                        <CircularProgress size={24} sx={{color: '#262626'}}/>
                    ) : (
                        <ButtonText isDisabled={!nickname.trim()}>
                            확인
                        </ButtonText>
                    )}
                </ConfirmButton>
            </ModalContainer>
        </Modal>
    );
};

export default NicknameModal;
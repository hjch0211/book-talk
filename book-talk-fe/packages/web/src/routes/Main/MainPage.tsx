import {Suspense, useEffect, useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import MainContainer from '../../components/MainContainer/MainContainer';
import PageWrapper from '../../components/PageWrapper/PageWrapper';
import LoginNicknameModal from './_components/NickNameModal/LoginNicknameModal.tsx';
import {useModal} from '../../hooks/useModal';
import {
    ButtonContainer,
    MainButton,
    MainButtonText,
    MainText,
    MainTextContainer,
    MainTextWrapper
} from './Main.style.tsx';
import MainHeader from "../../components/MainHeader/MainHeader.tsx";
import {useSuspenseQuery} from "@tanstack/react-query";
import {meQueryOption} from "../../apis/account";
import CreateDebateModal from "./_components/CreateDebateModal/CreateDebateModal.tsx";
import AuthRequiredModal from "../Debate/_components/AuthRequiredModal.tsx";

const TextSection = () => {
    const {data: me} = useSuspenseQuery(meQueryOption);

    return (
        <MainTextWrapper>
            <MainText>
                {me ? (
                    <>
                        안녕하세요 {me.name}님<br/>
                        아래 버튼을 눌러 토론을 시작해보세요!
                    </>
                ) : (
                    <>
                        이제는 BOOKTALK과 함께<br/>
                        온라인으로 독서토론을 즐겨요!
                    </>
                )}
            </MainText>
        </MainTextWrapper>
    );
};

const ButtonSection = () => {
    const {data: me} = useSuspenseQuery(meQueryOption);
    const {openModal} = useModal();

    const handleLogin = () => {
        openModal(LoginNicknameModal);
    };

    const handleCreateDebate = () => {
        openModal(CreateDebateModal);
    };

    return (
        <>
            {!me && <MainButton onClick={handleLogin}>
                <MainButtonText>닉네임 입력하기</MainButtonText>
            </MainButton>}

            <MainButton disabled={!me} onClick={me ? handleCreateDebate : undefined}>
                <MainButtonText disabled={!me}>토론방 생성하기</MainButtonText>
            </MainButton>
        </>
    );
};

export function MainPage() {
    const [searchParams] = useSearchParams();
    const [showAuthModal, setShowAuthModal] = useState(false);
    const {openModal} = useModal();

    useEffect(() => {
        const authParam = searchParams.get('auth');
        if (authParam === 'false') {
            setShowAuthModal(true);
        }
    }, [searchParams]);

    const handleLogin = () => {
        openModal(LoginNicknameModal);
    };

    return (
        <>
            <AuthRequiredModal
                open={showAuthModal}
                onClose={() => setShowAuthModal(false)}
                onLoginClick={handleLogin}
            />
            <PageWrapper bgColor="linear-gradient(180deg, #FFFFFF 39.9%, #FBEAE7 100%)">
                <MainContainer>
                    <MainHeader/>
                    <MainTextContainer>
                        <Suspense fallback={<></>}>
                            <TextSection/>
                        </Suspense>

                        <ButtonContainer>
                            <Suspense fallback={<></>}>
                                <ButtonSection/>
                            </Suspense>
                        </ButtonContainer>
                    </MainTextContainer>
                </MainContainer>
            </PageWrapper>
        </>
    );
}
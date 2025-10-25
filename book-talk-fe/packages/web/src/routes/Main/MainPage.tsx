import {Suspense} from 'react';
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
    return (
        <PageWrapper bgColor="linear-gradient(180deg, #FFFFFF 39.9%, #FBEAE7 100%)">
            <MainContainer>
                <MainHeader/>
                <MainTextContainer>
                    <MainTextWrapper>
                        <MainText>
                            이제는 BOOKTALK과 함께<br/>
                            온라인으로 독서토론을 즐겨요!
                        </MainText>
                    </MainTextWrapper>

                    <ButtonContainer>
                        <Suspense fallback={<></>}>
                            <ButtonSection/>
                        </Suspense>
                    </ButtonContainer>
                </MainTextContainer>
            </MainContainer>
        </PageWrapper>
    );
}
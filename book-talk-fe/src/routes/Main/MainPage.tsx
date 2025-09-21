import {Suspense} from 'react';
import MainContainer from '../../components/MainContainer/MainContainer';
import NicknameModal from './_components/NickNameModal/NicknameModal.tsx';
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
        openModal(NicknameModal);
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
    );
}
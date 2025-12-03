import {useNavigate} from 'react-router-dom';
import SpeakerNotesOffIcon from '@mui/icons-material/SpeakerNotesOff';
import {
    BackButton,
    BackButtonBase,
    BackButtonText,
    ContentWrapper,
    DebateFullContainer,
    FullRoomMessage,
    FullRoomTitle,
    IconContainer,
    TextWrapper
} from './DebateFull.style';
import PageContainer from "../../../components/templates/PageContainer";

export const DebateFull = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <PageContainer bgColor="linear-gradient(180deg, #FFFFFF 39.9%, #FBEAE7 100%)">
            <DebateFullContainer>
                <ContentWrapper>
                    <TextWrapper>
                        <FullRoomTitle>현재 방이 가득 차서 입장이 불가합니다.</FullRoomTitle>
                        <FullRoomMessage>메인페이지로 돌아가 새로운 토론방을 생성해보세요!</FullRoomMessage>
                    </TextWrapper>
                    <IconContainer>
                        <SpeakerNotesOffIcon sx={{width: 135, height: 124, color: '#8E99FF'}}/>
                    </IconContainer>
                </ContentWrapper>
                <BackButton onClick={handleGoHome}>
                    <BackButtonBase>
                        <BackButtonText>메인페이지로 이동</BackButtonText>
                    </BackButtonBase>
                </BackButton>
            </DebateFullContainer>
        </PageContainer>
    );
};

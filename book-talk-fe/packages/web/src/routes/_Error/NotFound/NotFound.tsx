import {useNavigate} from 'react-router-dom';
import SpeakerNotesOffIcon from '@mui/icons-material/SpeakerNotesOff';
import {
    BackButton,
    BackButtonBase,
    BackButtonText,
    ContentWrapper,
    ErrorContentWrapper,
    ErrorMessage,
    ErrorTitle,
    LogoContainer,
    NotFoundContainer
} from './NotFound.style';
import PageContainer from "../../../components/templates/PageContainer";

export const NotFound = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <PageContainer bgColor="linear-gradient(180deg, #FFFFFF 39.9%, #FBEAE7 100%)">
            <NotFoundContainer>
                <ContentWrapper>
                    <ErrorTitle>404 ERROR</ErrorTitle>
                    <ErrorContentWrapper>
                        <LogoContainer>
                            <SpeakerNotesOffIcon sx={{width: 135, height: 124, color: '#8E99FF'}}/>
                        </LogoContainer>
                        <ErrorMessage>요청하신 페이지를 찾을 수 없습니다.</ErrorMessage>
                    </ErrorContentWrapper>
                </ContentWrapper>
                <BackButton onClick={handleGoHome}>
                    <BackButtonBase>
                        <BackButtonText>메인페이지로 이동</BackButtonText>
                    </BackButtonBase>
                </BackButton>
            </NotFoundContainer>
        </PageContainer>
    );
};
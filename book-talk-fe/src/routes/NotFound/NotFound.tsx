import {useNavigate} from 'react-router-dom';
import MainContainer from '../../components/MainContainer/MainContainer';
import {BackButton, BackButtonText, ErrorMessage, ErrorTitle, LogoContainer, NotFoundContainer} from './NotFound.style';
import notFoundLogo from '../../assets/not-found-logo.svg';

export const NotFound = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <MainContainer>
            <NotFoundContainer>
                <LogoContainer>
                    <img src={notFoundLogo} alt="404 Not Found" width="120" height="106.19"/>
                </LogoContainer>
                <ErrorTitle>404 ERROR</ErrorTitle>
                <ErrorMessage>요청하신 페이지를 찾을 수 없습니다.</ErrorMessage>
                <BackButton onClick={handleGoHome}>
                    <BackButtonText>메인페이지로 이동</BackButtonText>
                </BackButton>
            </NotFoundContainer>
        </MainContainer>
    );
};
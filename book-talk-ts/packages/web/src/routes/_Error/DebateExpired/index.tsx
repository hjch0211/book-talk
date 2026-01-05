import SpeakerNotesOffIcon from '@mui/icons-material/SpeakerNotesOff';
import { useNavigate } from 'react-router-dom';
import PageContainer from '../../../components/templates/PageContainer';
import {
  BackButton,
  BackButtonBase,
  BackButtonText,
  ContentWrapper,
  DebateExpiredContainer,
  ExpiredRoomMessage,
  ExpiredRoomTitle,
  IconContainer,
  TextWrapper,
} from './style';

export const DebateExpired = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <PageContainer bgColor="linear-gradient(180deg, #FFFFFF 39.9%, #FBEAE7 100%)">
      <DebateExpiredContainer>
        <ContentWrapper>
          <TextWrapper>
            <ExpiredRoomTitle>생성된 지 24시간이 지나 종료된 토론방입니다.</ExpiredRoomTitle>
            <ExpiredRoomMessage>
              메인페이지로 돌아가 새로운 토론방을 생성해보세요!
            </ExpiredRoomMessage>
          </TextWrapper>
          <IconContainer>
            <SpeakerNotesOffIcon sx={{ width: 135, height: 124, color: '#8E99FF' }} />
          </IconContainer>
        </ContentWrapper>
        <BackButton onClick={handleGoHome}>
          <BackButtonBase>
            <BackButtonText>메인페이지로 이동</BackButtonText>
          </BackButtonBase>
        </BackButton>
      </DebateExpiredContainer>
    </PageContainer>
  );
};

import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import debateExpiredImage from '@src/assets/error/debate-expired.png';
import { ErrorImage } from '@src/routes/_Error/style.ts';
import { useNavigate } from 'react-router-dom';
import {
  ButtonText,
  Contents,
  ContentsFrame,
  ErrorGraphic,
  MainButton,
  RoomTerminatedContainer,
  Subtitle,
  TextGroup,
  Title,
} from './style';

export const DebateExpired = () => {
  const navigate = useNavigate();

  return (
    <RoomTerminatedContainer>
      <ContentsFrame>
        <Contents>
          <TextGroup>
            <Title>이미 토론이 종료된 방이에요</Title>
            <Subtitle>메인페이지에서 새로운 토론방을 생성해보세요!</Subtitle>
          </TextGroup>
          <MainButton onClick={() => navigate('/home')}>
            <ButtonText>메인페이지로 가기</ButtonText>
            <ArrowForwardIcon sx={{ width: 24, height: 24, color: '#434343' }} />
          </MainButton>
        </Contents>
      </ContentsFrame>
      <ErrorGraphic>
        <ErrorImage src={debateExpiredImage} alt="Debate expired" />
      </ErrorGraphic>
    </RoomTerminatedContainer>
  );
};

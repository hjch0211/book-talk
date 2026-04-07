import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import debateFulledError from '@src/assets/error/debate-fulled.png';
import { ErrorImage } from '@src/routes/_Error/style.ts';
import { useNavigate } from 'react-router-dom';
import {
  ButtonText,
  Contents,
  ContentsFrame,
  ErrorGraphic,
  MainButton,
  OccupiedRoomContainer,
  Subtitle,
  TextGroup,
  Title,
} from './style';

export const DebateFull = () => {
  const navigate = useNavigate();

  return (
    <OccupiedRoomContainer>
      <ContentsFrame>
        <Contents>
          <TextGroup>
            <Title>현재 방이 가득 차서 입장할 수 없어요</Title>
            <Subtitle>메인페이지에서 새로운 토론방을 생성해보세요!</Subtitle>
          </TextGroup>
          <MainButton onClick={() => navigate('/home')}>
            <ButtonText>메인페이지로 가기</ButtonText>
            <ArrowForwardIcon sx={{ width: 24, height: 24, color: '#434343' }} />
          </MainButton>
        </Contents>
      </ContentsFrame>
      <ErrorGraphic>
        <ErrorImage src={debateFulledError} alt="Unexpected error" />
      </ErrorGraphic>
    </OccupiedRoomContainer>
  );
};

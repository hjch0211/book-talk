import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import notFoundImage from '@src/assets/error/not-found.png';
import { useNavigate } from 'react-router-dom';
import {
  ButtonText,
  Contents,
  ContentsFrame,
  ErrorGraphic,
  ErrorImage,
  ErrorMessage,
  MainButton,
  NotFoundContainer,
} from '../style';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <NotFoundContainer>
      <ContentsFrame>
        <Contents>
          <ErrorMessage>찾으시던 페이지가 이동되었거나<br/>존재하지 않는 주소예요</ErrorMessage>
          <MainButton onClick={() => navigate('/home')}>
            <ButtonText>{"북톡 홈으로 가기"}</ButtonText>
            <ArrowForwardIcon sx={{ width: 24, height: 24, color: '#434343' }} />
          </MainButton>
        </Contents>
      </ContentsFrame>
      <ErrorGraphic>
        <ErrorImage src={notFoundImage} alt="404 Error" />
      </ErrorGraphic>
    </NotFoundContainer>
  );
};

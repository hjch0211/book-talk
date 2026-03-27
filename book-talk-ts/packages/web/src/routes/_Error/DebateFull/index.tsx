import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import unexpectedError from '@src/assets/error/unexpected-error.png';
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

export const DebateFull = () => {
  const navigate = useNavigate();

  return (
    <NotFoundContainer>
      <ContentsFrame>
        <Contents>
          <ErrorMessage>
            예상치 못한 오류가 발생했으니
            <br />
            잠시 후 다시 시도해주세요
          </ErrorMessage>
          <MainButton onClick={() => navigate('/home')}>
            <ButtonText>{'북톡 홈으로 가기'}</ButtonText>
            <ArrowForwardIcon sx={{ width: 24, height: 24, color: '#434343' }} />
          </MainButton>
        </Contents>
      </ContentsFrame>
      <ErrorGraphic>
        <ErrorImage src={unexpectedError} alt="Unexpected error" />
      </ErrorGraphic>
    </NotFoundContainer>
  );
};

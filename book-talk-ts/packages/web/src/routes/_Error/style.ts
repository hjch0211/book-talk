import styled from '@emotion/styled';

export const NotFoundContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  overflow: hidden;
  background: linear-gradient(180deg, #ffffff 0%, #fbeae7 100%);
`;

export const ContentsFrame = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 200px 0 0;
  width: 100%;
  height: 318px;
`;

export const Contents = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 36px;
`;

export const ErrorMessage = styled.p`
  font-family: 'S-Core Dream', sans-serif;
  font-weight: 500;
  font-size: 20px;
  line-height: 170%;
  text-align: center;
  letter-spacing: 0.3px;
  color: #262626;
  margin: 0;
`;

export const MainButton = styled.button`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: 12px 24px;
  gap: 8px;
  width: 185px;
  height: 48px;
  background: #ffffff;
  border-radius: 10px;
  border: none;
  cursor: pointer;

  &:hover {
    background: #f5f5f5;
  }
`;

export const ButtonText = styled.span`
  font-family: 'S-Core Dream', sans-serif;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  letter-spacing: 0.3px;
  color: #262626;
`;

export const ErrorGraphic = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: flex-end;
  padding: 200px 0 0;
  width: 100%;
  height: 740px;
`;

export const ErrorImage = styled.img`
  position: absolute;
  bottom: 0;
  width: 80%;
  object-fit: contain;
`;

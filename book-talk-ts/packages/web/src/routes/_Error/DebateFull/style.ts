import styled from '@emotion/styled';

export const OccupiedRoomContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  overflow: hidden;
  background: linear-gradient(180deg, #ffffff 0%, #f7f8ff 100%);
`;

export const ContentsFrame = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 200px 0 0;
  gap: 10px;
  width: 100%;
`;

export const Contents = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 36px;
  width: 394px;
`;

export const TextGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 394px;
`;

export const Title = styled.p`
  font-family: 'S-Core Dream', sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 24px;
  line-height: 125%;
  text-align: center;
  letter-spacing: 0.3px;
  color: #262626;
  margin: 0;
`;

export const Subtitle = styled.p`
  font-family: 'S-Core Dream', sans-serif;
  font-style: normal;
  font-weight: 200;
  font-size: 14px;
  line-height: 20px;
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
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  letter-spacing: 0.3px;
  color: #262626;
`;

export const ErrorGraphic = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  padding: 0;
  width: 100%;
  height: 507px;
`;

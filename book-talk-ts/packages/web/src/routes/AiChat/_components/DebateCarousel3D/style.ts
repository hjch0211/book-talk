import styled from '@emotion/styled';

export const Card = styled.div<{ $isSelected: boolean }>`
  width: 80%;
  height: 80%;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  cursor: pointer;
  font-family: 'S-Core Dream', sans-serif;
  user-select: none;
  transition: border 0.25s, box-shadow 0.25s;
  display: flex;
  flex-direction: row;
`;

export const CardImageArea = styled.div`
  flex: 0 0 90px;
  background: linear-gradient(160deg, #eaf0fb 0%, #d6e3f7 100%);
  border-radius: 16px 0 0 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

export const CardBookImage = styled.img`
  width: 62px;
  height: 88px;
  object-fit: cover;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.18);
  pointer-events: none;
`;

export const CardBody = styled.div`
  flex: 1;
  padding: 16px 14px 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow: hidden;
`;

export const CardTopic = styled.div`
  font-family: 'S-Core Dream', sans-serif;
  font-weight: 500;
  font-size: 11px;
  line-height: 1.6;
  letter-spacing: 0.3px;
  color: #4a5a6a;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const CardDescription = styled.div`
  font-family: 'S-Core Dream', sans-serif;
  font-weight: 300;
  font-size: 10px;
  line-height: 1.7;
  letter-spacing: 0.2px;
  color: #7a8898;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

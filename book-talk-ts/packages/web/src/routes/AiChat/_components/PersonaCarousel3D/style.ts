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
  flex-direction: column;
  clip-path: inset(0 round 16px);
`;

export const CardImageArea = styled.div`
  flex: 0 0 55%;
  background: linear-gradient(160deg, #eaf0fb 0%, #d6e3f7 100%);
  border-radius: 16px 16px 0 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  overflow: hidden;
`;

export const CardPersonaImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top center;
  pointer-events: none;
`;

export const CardBody = styled.div`
  flex: 1;
  padding: 6px 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  justify-content: center;
`;

export const CardName = styled.div`
  font-family: 'S-Core Dream', sans-serif;
  font-weight: 500;
  font-size: 12px;
  color: #4a5a6a;
  letter-spacing: 0.3px;
`;

export const CardDescription = styled.div`
  font-family: 'S-Core Dream', sans-serif;
  font-weight: 300;
  font-size: 10px;
  line-height: 1.7;
  color: #7a8898;
  letter-spacing: 0.2px;
`;

import styled from '@emotion/styled';

export const BackgroundCircle = styled.div`
  position: absolute;
  width: 398px;
  height: 398px;
  left: calc(50% - 398px/2);
  top: 465px;
  background: radial-gradient(circle, rgba(190, 195, 245, 0.3) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
  filter: blur(80px);
`;

export const AvatarIcon = styled.div`
  position: absolute;
  width: 40px;
  height: 40px;
  right: 210px;
  top: 80px;
  background: #EADDFF;
  border-radius: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  }

  &::after {
    content: '';
    position: absolute;
    width: 24px;
    height: 24px;
    background: #4F378A;
    mask: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>') no-repeat center;
    mask-size: contain;
  }
`;

export const MainTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 100px;
  position: absolute;
  width: 861px;
  left: 50%;
  transform: translateX(-50%);
  top: 293px;
`;

export const MainTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 36px;
  width: 861px;
`;

export const MainText = styled.h1`
  width: 861px;
  font-family: 'S-Core Dream', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 64px;
  line-height: 200%;
  text-align: center;
  letter-spacing: 0.3px;
  color: #000000;
  margin: 0;
`;

export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 18px;
  width: 360px;
`;

export const MainButton = styled.button<{ disabled?: boolean }>`
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 8px 20px;
  width: 360px;
  height: 80px;
  background: ${props => props.disabled ? '#D9D9D9' : '#BEC3F5'};
  box-shadow: ${props => props.disabled ? 'none' : '0px 2px 4px rgba(0, 0, 0, 0.25)'};
  border-radius: 8px;
  border: none;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease;

  &:hover {
    ${props => !props.disabled && `
      background: #A8B0F0;
      transform: translateY(-2px);
      box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3);
    `}
  }

  &:active {
    ${props => !props.disabled && `
      transform: translateY(0);
      box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
    `}
  }
`;

export const MainButtonText = styled.span<{ disabled?: boolean }>`
  font-family: 'S-Core Dream', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  font-style: normal;
  font-weight: 500;
  font-size: 24px;
  line-height: 125%;
  text-align: center;
  letter-spacing: 0.3px;
  color: ${props => props.disabled ? '#7B7B7B' : '#262626'};
`;
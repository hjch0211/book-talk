import styled from '@emotion/styled';

export const MainTextContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 100px;
    position: absolute;
    width: 100%;
    left: 50%;
    transform: translateX(-50%);
    top: 293px;
`;

export const MainTextWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 36px;
`;

export const MainText = styled.h1`
    font-family: 'S-Core Dream', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 500;
    font-size: 58px;
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
    background: ${(props) => (props.disabled ? '#D9D9D9' : '#BEC3F5')};
    box-shadow: ${(props) => (props.disabled ? 'none' : '0px 2px 4px rgba(0, 0, 0, 0.25)')};
    border-radius: 8px;
    border: none;
    cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
    transition: all 0.3s ease;

    &:hover {
        ${(props) =>
          !props.disabled &&
          `
      background: #A8B0F0;
      transform: translateY(-2px);
      box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3);
    `}
    }

    &:active {
        ${(props) =>
          !props.disabled &&
          `
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
    color: ${(props) => (props.disabled ? '#7B7B7B' : '#262626')};
`;

export const SurveyHyperLinkText = styled.a`
    font-family: 'S-Core Dream', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 500;
    font-size: 12px;
    line-height: 150%;
    text-align: center;
    letter-spacing: 0.3px;
    text-decoration-line: underline;
    color: #434343;
    align-self: stretch;
    cursor: pointer;
`;

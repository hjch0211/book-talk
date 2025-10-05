import styled from '@emotion/styled';

export const NotFoundContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 237px 349px;
    gap: 20px;
    position: relative;
    width: 1440px;
    height: 1024px;
    background: #FFFFFF;
`;

export const LogoContainer = styled.div`
    width: 120px;
    height: 106.19px;
    flex: none;
    order: 0;
    flex-grow: 0;
    position: relative;
`;

export const ErrorTitle = styled.h1`
    height: 60px;
    font-style: normal;
    font-weight: 600;
    font-size: 36px;
    line-height: 180%;
    letter-spacing: 0.3px;
    color: #000000;
    flex: none;
    order: 1;
    flex-grow: 0;
    margin: 0;
`;

export const ErrorMessage = styled.p`
    height: 41px;
    font-style: normal;
    font-weight: 500;
    font-size: 24px;
    line-height: 125%;
    letter-spacing: 0.3px;
    color: #000000;
    flex: none;
    order: 2;
    flex-grow: 0;
    margin: 0;
`;

export const BackButton = styled.button`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 16px 32px;
    width: 250px;
    height: 66px;
    background: #D8DBFF;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
    border-radius: 4px;
    border: none;
    cursor: pointer;
    flex: none;
    order: 3;
    flex-grow: 0;
    transition: all 0.3s ease;

    &:hover {
        background: #C4C9FF;
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    }

    &:active {
        transform: translateY(0);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
    }
`;

export const BackButtonText = styled.span`
    height: 34px;
    font-style: normal;
    font-weight: 500;
    font-size: 20px;
    line-height: 170%;
    text-align: center;
    letter-spacing: 0.3px;
    color: #262626;
`;
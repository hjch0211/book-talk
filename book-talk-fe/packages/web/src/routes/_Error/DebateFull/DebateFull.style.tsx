import styled from '@emotion/styled';

export const DebateFullContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`;

export const ContentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0px;
    gap: 80px;
    position: absolute;
    width: 624px;
    height: 287px;
    top: 256px;
`;

export const TextWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0px;
    gap: 18px;
    width: 624px;
    height: 117px;
    flex: none;
    order: 0;
    flex-grow: 0;
`;

export const FullRoomTitle = styled.h1`
    width: 624px;
    height: 65px;
    font-family: 'S-Core Dream';
    font-style: normal;
    font-weight: 600;
    font-size: 36px;
    line-height: 180%;
    text-align: center;
    letter-spacing: 0.3px;
    color: #000000;
    margin: 0;
    flex: none;
    order: 0;
    flex-grow: 0;
`;

export const FullRoomMessage = styled.p`
    height: 34px;
    font-family: 'S-Core Dream';
    font-style: normal;
    font-weight: 500;
    font-size: 20px;
    line-height: 170%;
    text-align: center;
    letter-spacing: 0.3px;
    color: #7B7B7B;
    margin: 0;
    flex: none;
    order: 1;
    flex-grow: 0;
`;

export const IconContainer = styled.div`
    width: 135px;
    height: 124px;
    flex: none;
    order: 1;
    flex-grow: 0;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const BackButton = styled.button`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 16px 32px;
    position: absolute;
    width: 250px;
    height: 66px;
    top: 668px;
    margin: 0;
    background: #D8DBFF;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
    border-radius: 4px;
    border: none;
    cursor: pointer;
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

export const BackButtonBase = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 0px;
    gap: 8px;
    width: 162px;
    height: 34px;
    flex: none;
    order: 0;
    flex-grow: 0;
`;

export const BackButtonText = styled.span`
    height: 34px;
    font-family: 'S-Core Dream';
    font-style: normal;
    font-weight: 500;
    font-size: 20px;
    line-height: 170%;
    text-align: center;
    letter-spacing: 0.3px;
    color: #262626;
    flex: none;
    order: 1;
    flex-grow: 0;
`;

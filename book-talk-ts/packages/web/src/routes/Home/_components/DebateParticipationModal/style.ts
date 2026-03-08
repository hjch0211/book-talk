import styled from '@emotion/styled';
import { Box, Button, Typography } from '@mui/material';

export const ModalContainer = styled(Box)`
    display: flex;
    flex-direction: column;
    padding: 40px 60px 40px 40px;
    box-sizing: border-box;
    width: 100%;
`;

export const InnerWrapper = styled(Box)`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 20px;
    width: 780px;
`;

export const ContentArea = styled(Box)`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 60px;
    width: 780px;
`;

export const ModalTitle = styled(Typography)`
    font-family: 'S-Core Dream', sans-serif;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
    letter-spacing: 1px;
    color: #262626;
`;

export const ContentRow = styled(Box)`
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: 30px;
    width: 780px;
`;

export const BookProfile = styled(Button)`
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 10px;
    gap: 5px;
    width: 100px;
    min-width: 100px;
    height: 140px;
    border: 1px solid #E8EBFF;
    border-radius: 10px;
    background: none;
    transition: border-color 0.2s;

    &:hover {
        border-color: #8E99FF;
        background: none;
    }
`;

export const BookImageBox = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'imageUrl',
})<{ imageUrl?: string | null }>`
    width: 61px;
    height: 89px;
    background-color: #ECECEC;
    ${({ imageUrl }) => (imageUrl ? `background-image: url(${imageUrl});` : '')}
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
`;

export const BookInfoLink = styled(Typography)`
    font-family: 'S-Core Dream', sans-serif;
    font-weight: 200;
    font-size: 10px;
    line-height: 150%;
    text-align: center;
    letter-spacing: 0.3px;
    text-decoration: underline;
    color: #262626;
    cursor: pointer;
`;

export const InfoColumn = styled(Box)`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;
    flex: 1;
    min-width: 0;
`;

export const TextSection = styled(Box)`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    width: 100%;
`;

export const DebateTopic = styled(Typography)`
    font-family: 'S-Core Dream', sans-serif;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 1px;
    color: #262626;
    height: 48px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
`;

export const DebateDescription = styled(Typography)`
    font-family: 'S-Core Dream', sans-serif;
    font-weight: 200;
    font-size: 16px;
    line-height: 180%;
    letter-spacing: 0.3px;
    color: #262626;
    height: 230px;
    display: -webkit-box;
    -webkit-line-clamp: 8;
    -webkit-box-orient: vertical;
    overflow: hidden;
`;

export const Divider = styled(Box)`
    width: 100%;
    height: 1px;
    background-color: #E8EBFF;
`;

export const MetaSection = styled(Box)`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
`;

export const MetaRow = styled(Box)`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
`;

export const DateTimeGroup = styled(Box)`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
`;

export const MetaLabel = styled(Typography)`
    font-family: 'S-Core Dream', sans-serif;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 1px;
    color: #262626;
`;

export const MetaValue = styled(Typography)`
    font-family: 'S-Core Dream', sans-serif;
    font-weight: 200;
    font-size: 16px;
    line-height: 180%;
    letter-spacing: 0.3px;
    color: #262626;
`;

export const WarningNotice = styled(Box)`
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: 3px;
`;

export const WarningAsterisk = styled(Typography)`
    font-family: 'S-Core Dream', sans-serif;
    font-weight: 200;
    font-size: 12px;
    line-height: 150%;
    letter-spacing: 0.3px;
    color: #FF5D22;
`;

export const WarningText = styled(Typography)`
    font-family: 'S-Core Dream', sans-serif;
    font-weight: 200;
    font-size: 12px;
    line-height: 150%;
    letter-spacing: 0.3px;
    color: #262626;
`;

export const ButtonRow = styled(Box)`
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    gap: 8px;
`;

export const ButtonSection = styled(Box)`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    width: 250px;
`;

export const Caption = styled(Typography)`
    font-family: 'S-Core Dream', sans-serif;
    font-weight: 200;
    font-size: 12px;
    line-height: 150%;
    letter-spacing: 0.3px;
    color: #262626;
`;

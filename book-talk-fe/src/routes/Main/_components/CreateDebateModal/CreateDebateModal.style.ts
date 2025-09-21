import styled from '@emotion/styled';
import {Box, Button, TextField, Typography, Paper, List, ListItem} from '@mui/material';

export const ModalContainer = styled(Box)`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 60px 80px 80px;
    gap: 36px;
    height: 100%;
`;

export const ModalTitle = styled(Typography)`
    font-family: 'S-Core Dream', sans-serif;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
    letter-spacing: 1px;
    color: #555555;
`;

export const FormContainer = styled(Box)`
    display: flex;
    flex-direction: column;
    gap: 32px;
    width: 670px;
    position: relative;
`;

export const StyledTextField = styled(TextField)`
    width: 100%;

    & .MuiOutlinedInput-root {
        height: 56px;
        border-radius: 4px;

        & fieldset {
            border-color: rgba(0, 0, 0, 0.23);
        }

        &:hover fieldset {
            border-color: rgba(0, 0, 0, 0.23);
        }

        &.Mui-focused fieldset {
            border-color: #BEC3F5;
        }
    }

    & .MuiInputBase-input {
        font-family: 'Roboto', sans-serif;
        font-size: 16px;
        line-height: 24px;
        letter-spacing: 0.15px;

        &::placeholder {
            color: rgba(0, 0, 0, 0.38);
            opacity: 1;
        }
    }

    & .MuiInputLabel-root {
        font-family: 'Roboto', sans-serif;
        font-size: 12px;
        letter-spacing: 0.15px;
        color: rgba(0, 0, 0, 0.6);
    }
`;

export const MultilineTextField = styled(TextField)`
    width: 100%;

    & .MuiOutlinedInput-root {
        border-radius: 4px;

        & fieldset {
            border-color: rgba(0, 0, 0, 0.23);
        }

        &:hover fieldset {
            border-color: rgba(0, 0, 0, 0.23);
        }

        &.Mui-focused fieldset {
            border-color: #BEC3F5;
        }
    }

    & .MuiInputBase-input {
        font-family: 'Roboto', sans-serif;
        font-size: 16px;
        line-height: 24px;
        letter-spacing: 0.15px;

        &::placeholder {
            color: rgba(0, 0, 0, 0.38);
            opacity: 1;
        }
    }

    & .MuiInputLabel-root {
        font-family: 'Roboto', sans-serif;
        font-size: 12px;
        letter-spacing: 0.15px;
        color: rgba(0, 0, 0, 0.6);
    }
`;

export const SubmitButton = styled(Button)<{ isValid?: boolean }>`
    width: 160px;
    height: 60px;
    background-color: ${({ isValid }) => isValid ? '#BEC3F5' : 'rgba(0, 0, 0, 0.12)'};
    color: ${({ isValid }) => isValid ? '#262626' : 'rgba(0, 0, 0, 0.38)'};
    border-radius: 4px;
    font-family: 'S-Core Dream', sans-serif;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 1px;
    text-transform: none;

    &:hover {
        background-color: ${({ isValid }) => isValid ? '#A8ADF0' : 'rgba(0, 0, 0, 0.12)'};
    }

    &:disabled {
        background-color: rgba(0, 0, 0, 0.12);
        color: rgba(0, 0, 0, 0.38);
    }
`;

export const SearchInputWrapper = styled(Box)`
    position: relative;
    width: 100%;
`;

export const SearchDropdown = styled(Paper)`
    position: absolute;
    top: 60px;
    left: 0;
    right: 0;
    max-height: 400px;
    overflow-y: auto;
    z-index: 1000;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
    background: #FFFFFF;
`;

export const SearchResultList = styled(List)`
    padding: 0;
`;

export const SearchResultItem = styled(ListItem)`
    display: flex;
    align-items: center;
    padding: 5px 20px;
    gap: 14px;
    height: 96px;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
        background-color: #F5F5F5;
    }
`;

export const BookImage = styled(Box)`
    width: 80px;
    height: 80px;
    background-color: #ECECEC;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    flex-shrink: 0;
`;

export const BookInfo = styled(Box)`
    display: flex;
    flex-direction: column;
    gap: 5px;
    flex: 1;
    min-width: 0;
`;

export const BookTitle = styled(Typography)`
    font-family: 'S-Core Dream', sans-serif;
    font-weight: 500;
    font-size: 12px;
    line-height: 20px;
    letter-spacing: 1px;
    color: #000000;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
`;

export const BookAuthor = styled(Typography)`
    font-family: 'S-Core Dream', sans-serif;
    font-weight: 200;
    font-size: 12px;
    line-height: 150%;
    letter-spacing: 0.3px;
    color: #000000;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
`;

export const NoResultText = styled(Typography)`
    padding: 20px;
    text-align: center;
    font-family: 'S-Core Dream', sans-serif;
    font-size: 14px;
    color: #666666;
`;
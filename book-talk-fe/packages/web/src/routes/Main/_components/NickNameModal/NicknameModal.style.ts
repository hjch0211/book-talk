import styled from '@emotion/styled';
import {Box, Button, TextField, Typography} from '@mui/material';

export const ModalContainer = styled(Box)`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 120px;
    position: absolute;
    width: 564px;
    left: 50%;
    top: 110px;
    transform: translateX(-50%);
`;

export const ContentWrapper = styled(Box)`
    display: flex;
    flex-direction: column;
    gap: 60px;
    width: 564px;
`;

export const ModalTitle = styled(Typography)`
    font-family: 'S-Core Dream', sans-serif;
    font-weight: 500;
    font-size: 28px;
    line-height: 125%;
    letter-spacing: 0.3px;
    color: #000000;
`;

export const InputWrapper = styled(Box)`
    width: 100%;
`;

export const StyledTextField = styled(TextField)`
    width: 564px;

    & .MuiOutlinedInput-root {
        height: 56px;
        border-radius: 4px;

        & fieldset {
            border-color: #C4C4C4;
        }

        &:hover fieldset {
            border-color: #C4C4C4;
        }

        &.Mui-focused fieldset {
            border-color: #BEC3F5;
        }

        &.Mui-error fieldset {
            border-color: #f44336;
        }
    }

    & .MuiInputBase-input {
        font-family: 'Roboto', sans-serif;
        font-size: 16px;
        line-height: 24px;
        letter-spacing: 0.15px;

        &::placeholder {
            color: #7B7B7B;
            opacity: 1;
        }
    }

    & .MuiFormHelperText-root {
        font-family: 'Roboto', sans-serif;
        font-size: 12px;
        margin-top: 8px;
        color: #f44336;
    }
`;

export const LoadingMessage = styled(Typography)`
    margin-top: 8px;
    font-size: 14px;
    color: #666;
    font-family: 'Roboto', sans-serif;
`;

export const ConfirmButton = styled(Button)`
    width: 160px;
    height: 76px;
    background-color: #BEC3F5;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
    border-radius: 8px;
    position: relative;

    &:hover {
        background-color: #A8B0F0;
        transform: translateY(-2px);
        box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.3);
    }

    &:disabled {
        background-color: #D9D9D9;
        color: #7B7B7B;
    }
`;

export const ButtonText = styled(Typography)<{ isDisabled?: boolean }>`
    font-family: 'S-Core Dream', sans-serif;
    font-weight: 500;
    font-size: 24px;
    line-height: 125%;
    text-align: center;
    letter-spacing: 0.3px;
    color: ${({isDisabled}) => isDisabled ? '#7B7B7B' : '#262626'};
    text-transform: none;
`;
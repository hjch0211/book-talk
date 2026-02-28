import styled from '@emotion/styled';
import { Box, Button, List, ListItem, Paper, Select, TextField, Typography } from '@mui/material';

export const ModalContainer = styled(Box)`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 30px 130px;
    gap: 48px;
    height: 100%;
    overflow-y: auto;
    box-sizing: border-box;
`;

export const ModalTitle = styled(Typography)`
    font-family: 'S-Core Dream', sans-serif;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
    letter-spacing: 1px;
    color: #545454;
    align-self: stretch;
`;

export const FormContainer = styled(Box)`
    display: flex;
    flex-direction: column;
    gap: 36px;
    width: 670px;
`;

export const FieldSection = styled(Box)`
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 670px;
`;

export const FieldLabelRow = styled(Box)`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
`;

export const FieldLabelInner = styled(Box)`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 3px;
`;

export const FieldLabel = styled(Typography)`
    font-family: 'S-Core Dream', sans-serif;
    font-weight: 200;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.3px;
    color: #262626;
`;

export const RequiredMark = styled(Typography)`
    font-family: 'S-Core Dream', sans-serif;
    font-weight: 200;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.3px;
    color: #FF5D22;
`;

export const FieldHint = styled(Typography)`
    font-family: 'S-Core Dream', sans-serif;
    font-weight: 200;
    font-size: 12px;
    line-height: 150%;
    letter-spacing: 0.3px;
    color: #262626;
`;

export const InputBox = styled(Box)<{ highlight?: boolean }>`
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 12px 20px;
    width: 670px;
    height: 49px;
    background: #FFFFFF;
    border: 1px solid ${({ highlight }) => (highlight ? '#8E99FF' : '#C4C4C4')};
    border-radius: 6px;
    gap: 12px;
`;

export const StyledInput = styled.input`
    flex: 1;
    border: none;
    outline: none;
    font-family: 'S-Core Dream', sans-serif;
    font-weight: 200;
    font-size: 14px;
    line-height: 180%;
    letter-spacing: 0.5px;
    color: #262626;
    background: transparent;
    min-width: 0;

    &::placeholder {
        color: #C4C4C4;
    }
`;

export const SubmitButton = styled(Button)<{ isValid?: boolean }>`
    width: 250px;
    height: 60px;
    background-color: ${({ isValid }) => (isValid ? '#8E99FF' : '#C4C4C4')};
    color: ${({ isValid }) => (isValid ? '#FFFFFF' : '#7B7B7B')};
    border: 1px solid ${({ isValid }) => (isValid ? '#8E99FF' : '#D9D9D9')};
    border-radius: 10px;
    font-family: 'S-Core Dream', sans-serif;
    font-weight: 500;
    font-size: 14px !important;
    line-height: 20px;
    letter-spacing: 0.3px;
    text-transform: none;

    &:hover {
        background-color: ${({ isValid }) => (isValid ? '#7B87F0' : '#C4C4C4')};
    }

    &:disabled {
        background-color: #C4C4C4;
        color: #7B7B7B;
        border-color: #D9D9D9;
    }
`;

export const SearchInputWrapper = styled(Box)`
    position: relative;
    width: 100%;
`;

export const SearchDropdown = styled(Paper)`
    position: absolute;
    top: 49px;
    left: 0;
    right: 0;
    max-height: 300px;
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

export const ScheduleRow = styled(Box)`
    display: flex;
    flex-direction: row;
    gap: 10px;
    width: 670px;
`;

export const ScheduleTextField = styled(TextField)`
    width: 330px;

    .MuiOutlinedInput-root {
        height: 49px;
        border-radius: 6px;
        font-family: 'S-Core Dream', sans-serif;
        font-weight: 200;
        font-size: 14px;
        letter-spacing: 0.5px;
        color: #262626;

        fieldset {
            border-color: #C4C4C4;
        }

        &:hover fieldset {
            border-color: #C4C4C4;
        }

        &.Mui-focused fieldset {
            border-color: #8E99FF;
            border-width: 1px;
        }
    }

    .MuiInputBase-input {
        padding: 12px 20px;
        font-family: 'S-Core Dream', sans-serif;
        font-weight: 200;
        font-size: 14px;

        /* hide browser's native calendar/clock icon so our custom icon shows */
        &::-webkit-calendar-picker-indicator {
            opacity: 0;
            position: absolute;
            right: 8px;
            width: 32px;
            height: 32px;
            cursor: pointer;
        }
    }
`;

export const ParticipantSelect = styled(Select<number>)`
    width: 74px;
    height: 49px;
    border-radius: 6px;

    .MuiOutlinedInput-notchedOutline {
        border-color: #C4C4C4;
    }

    &:hover .MuiOutlinedInput-notchedOutline {
        border-color: #C4C4C4;
    }

    &.Mui-focused .MuiOutlinedInput-notchedOutline {
        border-color: #8E99FF;
        border-width: 1px;
    }

    .MuiSelect-select {
        padding: 12px 0 12px 20px !important;
        font-family: 'S-Core Dream', sans-serif;
        font-weight: 200;
        font-size: 14px;
        letter-spacing: 0.3px;
        color: #262626;
    }

    .MuiSelect-icon {
        color: #262626;
        right: 4px;
    }
`;

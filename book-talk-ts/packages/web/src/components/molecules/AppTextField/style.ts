import styled from '@emotion/styled';
import { TextField } from '@mui/material';

export const StyledTextField = styled(TextField, {
  shouldForwardProp: (prop) => prop !== 'success',
})<{ success?: boolean }>`
  width: 100%;

  .MuiOutlinedInput-root {
    height: 49px;

    &.MuiInputBase-multiline {
      height: auto;
      min-height: 52px;
    }
    border-radius: 6px;
    font-weight: 200;
    font-size: 14px;
    letter-spacing: 0.3px;
    color: rgba(0, 0, 0, 0.87);

    fieldset {
      border-color: ${({ success }) => (success ? '#1A00E2' : '#d9d9d9')};
      transition: border-color 0.2s ease;
    }

    &:hover fieldset {
      border-color: ${({ success }) => (success ? '#1A00E2' : '#d9d9d9')};
    }

    &.Mui-focused fieldset {
      border-color: ${({ success }) => (success ? '#1A00E2' : '#8979ff')};
      border-width: 1px;
    }

    &.Mui-disabled {
      background-color: #f5f5f5;
      border-radius: 12px;
      cursor: none;

      fieldset {
        border-color: #e0e0e0;
      }
    }
  }

  .MuiInputBase-input {
    &::placeholder {
      color: rgba(0, 0, 0, 0.6);
      opacity: 1;
      font-weight: 200;
      font-size: 14px;
      letter-spacing: 0.3px;
    }

    &.Mui-disabled {
      -webkit-text-fill-color: rgba(0, 0, 0, 0.38);
    }
  }
`;

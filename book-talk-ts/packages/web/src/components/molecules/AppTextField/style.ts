import styled from '@emotion/styled';
import { TextField } from '@mui/material';

export const StyledTextField = styled(TextField)`
  width: 100%;

  .MuiOutlinedInput-root {
    height: 52px;
    border-radius: 12px;
    font-weight: 200;
    font-size: 14px;
    letter-spacing: 0.3px;
    color: rgba(0, 0, 0, 0.87);

    fieldset {
      border-color: #d9d9d9;
    }

    &:hover fieldset {
      border-color: #d9d9d9;
    }

    &.Mui-focused fieldset {
      border-color: #8979ff;
      border-width: 1px;
    }
  }

  .MuiInputBase-input::placeholder {
    color: rgba(0, 0, 0, 0.6);
    opacity: 1;
    font-weight: 200;
    font-size: 14px;
    letter-spacing: 0.3px;
  }
`;

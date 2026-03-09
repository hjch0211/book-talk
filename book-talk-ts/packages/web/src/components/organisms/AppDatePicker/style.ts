import { TextField } from '@mui/material';
import { styled } from '@mui/material/styles';

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
      border-color: #d9d9d9;
      transition: border-color 0.2s ease;
    }

    &:hover fieldset {
      border-color: #d9d9d9;
    }

    &.Mui-focused fieldset {
      border-color: #8e99ff;
      border-width: 1px;
    }
  }

  .MuiInputBase-input {
    padding: 12px 20px;
    font-family: 'S-Core Dream', sans-serif;
    font-weight: 200;
    font-size: 14px;
  }
`;

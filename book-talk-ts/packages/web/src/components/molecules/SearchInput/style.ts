import styled from '@emotion/styled';
import { Search } from '@mui/icons-material';
import { OutlinedInput } from '@mui/material';

export const SearchIcon = styled(Search)`
  && {
    color: #434343;
    font-size: 24px;
  }
`;

export const StyledInput = styled(OutlinedInput)`
  && {
    width: 350px;
    height: 48px;
    border-radius: 8px;
    font-family: 'S-Core Dream', sans-serif;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.3px;
    color: #434343;
    background: #ffffff;
  }

  && fieldset {
    border: 1px solid #c4c4c4;
  }

  &&:hover fieldset,
  &&.Mui-focused fieldset {
    border: 1px solid #8E99FF;
  }
`;

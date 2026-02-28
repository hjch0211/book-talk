import styled from '@emotion/styled';
import { Pagination } from '@mui/material';

export const StyledPagination = styled(Pagination)`
  & ul {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    flex-wrap: nowrap;
    padding: 0px 6px;
    gap: 6px;
  }

  & li {
    width: 40px;
    height: 40px;
    margin: 0;
    padding: 0;
  }

  & .MuiPaginationItem-root {
    width: 40px;
    height: 40px;
    min-width: 0;
    margin: 0;
    padding: 0;
    border-radius: 100px;
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 143%;
    letter-spacing: 0.17px;
    color: #262626;
  }

  & .MuiPaginationItem-previousNext,
  & .MuiPaginationItem-firstLast {
    border-radius: 4px;
  }

  & .MuiPaginationItem-root.Mui-selected {
    background-color: #e9e9e9;
    &:hover {
      background-color: #e9e9e9;
    }
  }

  & .MuiPaginationItem-root.Mui-disabled {
    opacity: 0.38;
  }
`;

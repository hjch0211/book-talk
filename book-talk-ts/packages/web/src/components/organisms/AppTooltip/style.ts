import styled from '@emotion/styled';
import { MenuItem, Typography } from '@mui/material';

export const TriggerWrapper = styled.div`
    display: inline-flex;
    align-items: center;
    cursor: pointer;
`;

export const TriggerButton = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    flex-shrink: 0;
    cursor: pointer;
    color: #7B7B7B;
    border-radius: 50%;
    transition: background-color 0.15s ease, color 0.15s ease;

    &:hover {
        background-color: rgba(0, 0, 0, 0.08);
        color: #262626;
    }
`;

export const menuPaperSx = {
  width: '180px',
  boxShadow: '0px 2px 50px 10px #E9E9E9',
  borderRadius: '12px',
  padding: '0px',
} as const;

export const menuListSx = {
  display: 'flex',
  flexDirection: 'column',
  padding: '8px 0px',
  gap: '8px',
} as const;

export const StyledMenuItem = styled(MenuItem)`
    width: 180px;
    height: 32px;
    padding: 6px 16px;
`;

export const ItemLabel = styled(Typography)`
    color: #434343;
`;

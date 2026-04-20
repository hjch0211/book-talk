import styled from '@emotion/styled';
import { Button } from '@mui/material';

export const NavigationBar = styled.div`
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    padding: 0px 100px;
    gap: 10px;
    width: 100%;
    height: 90px;
    background: linear-gradient(360deg, rgba(255, 255, 255, 0) 0%, #FFFFFF 9.13%);
    border-bottom: 1px solid #E8EBFF;
    z-index: 10;
    flex: none;
    align-self: stretch;
    flex-grow: 0;
`;

export const NavContent = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0;
    width: 1240px;
    height: 58px;
    flex: none;
    order: 0;
    align-self: stretch;
    flex-grow: 0;
`;

export const DebateTitle = styled.h1`
    width: 975px;
    height: 54px;
    margin: 0;
    font-family: 'S-Core Dream', sans-serif;
    font-style: normal;
    font-weight: 500;
    font-size: 18px;
    line-height: 150%;
    letter-spacing: 1px;
    color: #262626;
    flex: none;
    order: 0;
    flex-grow: 0;
    display: flex;
    align-items: center;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
`;

export const NavButtonGroup = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0;
    gap: 30px;
    width: 200px;
    height: 40px;
    flex: none;
    order: 1;
    flex-grow: 0;
`;

export const NavButtonsSubGroup = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 0;
    gap: 18px;
    width: 98px;
    height: 40px;
    flex: none;
    order: 2;
    flex-grow: 0;
`;

export const NavButton = styled(Button)`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 8px 11px;
    width: auto;
    height: 40px;
    border-radius: 4px;
    font-family: 'S-Core Dream', sans-serif;
    font-weight: 500;
    font-size: 12px !important;
    line-height: 20px;
    letter-spacing: 1px;
    color: #7B7B7B;
    text-transform: none;
    min-width: fit-content;
    flex: none;
    flex-grow: 0;
    background: transparent;
    border: none;
    box-shadow: none;

    && .MuiButton-startIcon {
        margin: 0;
        display: flex;
        align-items: center;
        justify-content: center;

        & svg {
            width: 18px;
            height: 18px;
            color: #7B7B7B;
        }
    }

    &:hover {
        background-color: rgba(0, 0, 0, 0.04);
        box-shadow: none;
    }

    &:focus {
        box-shadow: none;
    }

    &:active {
        box-shadow: none;
    }

    &.Mui-focusVisible {
        box-shadow: none;
    }
`;

/* ── Mobile Nav Styles ── */

export const MobileNavBarStyled = styled.div`
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding: 10px 17px 3px;
    gap: 18px;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: #FFFFFF;
    border-bottom: 0.5px solid #E2E2E2;
    z-index: 10;
`;

export const MobileNavTitle = styled.div`
    flex: 1;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
`;

export const MobileNavIcons = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 12px;
    height: 33px;
    flex-shrink: 0;
`;

export const MobileAiBoogieButton = styled.button`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0;
    width: 40px;
    height: 33px;
    background: none;
    border: none;
    cursor: pointer;
    gap: 2px;
`;

export const MobileMenuButton = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 4px 5px;
    width: 26px;
    height: 32px;
    background: none;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    color: #434343;

    &:hover {
        background: rgba(0, 0, 0, 0.04);
    }
`;

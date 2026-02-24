import styled from '@emotion/styled';

export const LogoContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 20px;
    width: 182px;
    height: 44px;
`;

export const LogoWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 13px;
    width: 50px;
    height: 44px;
`;

export const LogoText = styled.div`
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
    font-style: normal;
    font-weight: 700;
    font-size: 14px;
    line-height: 20px;
    text-align: center;
    color: #000000;
`;

export const NavMenuGroup = styled.nav`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 24px;
`;

export const NavMenuItemText = styled.span`
    font-family: 'S-Core Dream', sans-serif;
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 1px;
    color: #262626;
    cursor: pointer;

    &:hover {
        color: #8E99FF;
    }
`;

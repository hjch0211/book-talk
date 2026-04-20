import styled from '@emotion/styled';
import { Box, ListItem } from '@mui/material';

/* ── PCDebateMemberList ── */

export const MemberListContainer = styled(Box)`
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px;
    gap: 18px;
    isolation: isolate;
    width: 320px;
    height: 488px;
    background: #FFFFFF;
    border-width: 0px 0px 1px 1px;
    border-style: solid;
    border-color: #E8EBFF;
    border-radius: 24px 0px 0px 24px;
    position: relative;
`;

export const MemberListHeader = styled.div`
    width: 320px;
    height: 40px;
    background: #FFFFFF;
    border-radius: 24px;
    position: relative;
    display: flex;
    align-items: center;
    padding-left: 6px;
    flex: none;
    order: 0;
    align-self: stretch;
    flex-grow: 0;
    z-index: 0;
`;

export const MemberListHeaderText = styled.div`
    position: absolute;
    height: 20px;
    left: 24px;
    top: calc(50% - 10px);
    font-family: 'S-Core Dream', sans-serif;
    font-weight: 200;
    font-size: 14px;
    line-height: 20px;
    text-align: center;
    letter-spacing: 0.3px;
    color: #000000;
`;

export const MemberList = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    padding: 0px 0px 0px 8px;
    gap: 24px;
    width: 100%;
    height: 430px;
    overflow-y: scroll;
    flex: none;
    order: 1;
    flex-grow: 0;
    z-index: 1;

    &::-webkit-scrollbar {
        display: none;
    }

    -ms-overflow-style: none;
    scrollbar-width: none;
`;

export const MemberListGradient = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    width: 320px;
    height: 40px;
    background: linear-gradient(180deg, rgba(247, 248, 255, 0) 0%, #F7F8FF 100%);
    border-radius: 0px 0px 0px 24px;
    pointer-events: none;
    z-index: 2;
`;

export const MemberItem = styled(ListItem)`
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding: 0;
    gap: 0;
    width: 100%;
    min-height: 76px;
    flex: none;
    align-self: stretch;
    flex-grow: 0;

    &:hover {
        background-color: transparent;
    }

    .MuiListItem-root {
        padding: 0;
    }
`;

export const MemberOrder = styled.div`
    position: absolute;
    width: 7px;
    height: 13px;
    left: 8.5px;
    top: 37px;
    font-family: 'S-Core Dream', sans-serif;
    font-weight: 300;
    font-size: 11px;
    line-height: 13px;
    color: #434343;
`;

export const MemberProfile = styled.div<{ $isCurrentSpeaker?: boolean }>`
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding: 0px 18px 0px 12px;
    gap: 10px;
    isolation: isolate;
    width: 280px;
    height: 76px;
    background: ${(props) => (props.$isCurrentSpeaker ? '#F7F8FF' : '#FFFFFF')};
    border-radius: 2px 50px 50px 2px;
    flex: none;
    order: 1;
    flex-grow: 0;
    transition: background-color 0.2s ease;

    &:hover {
        background-color: rgba(0, 0, 0, 0.04);
        cursor: pointer;
    }
`;

export const MemberProfileFrame = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0px;
    gap: 18px;
    width: 100%;
`;

export const MemberProfileBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0px;
    gap: 12px;
    flex: none;
    order: 0;
    flex-grow: 1;
`;

export const MemberInfo = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 9px;
    flex: none;
`;

export const MemberName = styled.div`
    font-family: 'S-Core Dream', sans-serif;
    font-weight: 200;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.3px;
    color: #555555;
    flex: none;
    order: 0;
    flex-grow: 0;
    display: flex;
    align-items: center;
    gap: 2px;
`;

export const AvatarContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0px;
    isolation: isolate;
    width: 32px;
    height: 32px;
    border-radius: 4px;
    flex: none;
    order: 0;
    flex-grow: 0;
    position: relative;
`;

export const BookCrownIcon = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: absolute;
    width: 64px;
    height: 36px;
    left: -26px;
    top: -13px;
    transform: rotate(-21.57deg);
    flex: none;
    order: 1;
    flex-grow: 0;
    z-index: 1;
`;

export const CurrentUserIndicator = styled.span`
    font-family: 'S-Core Dream', sans-serif;
    font-weight: 200;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.3px;
    color: #555555;
    flex: none;
    order: 1;
    flex-grow: 0;
`;

export const SpeakerTimer = styled.div`
    font-family: 'S-Core Dream', sans-serif;
    font-weight: 300;
    font-size: 11px;
    line-height: 13px;
    color: #7B7B7B;
    margin-left: auto;
`;

export const MemberOrderContainer = styled(Box)`
    position: relative;
    width: 24px;
    height: 50px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

export const RaisedHandIcon = styled(Box)`
    transition: opacity 0.3s ease-in-out;
    pointer-events: none;
`;

export const StateTimeBadge = styled.div<{ $variant?: 'current' | 'next' | 'connecting' }>`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 8px;
    padding: 2px 8px;
    border-radius: 35px;
    border: 1px solid ${(props) => (props.$variant === 'current' ? '#BEC3F5' : '#E9E9E9')};
    font-family: 'S-Core Dream', sans-serif;
    font-weight: 200;
    font-size: 12px;
    line-height: 150%;
    letter-spacing: 0.3px;
    color: #7B7B7B;
    white-space: nowrap;
`;

/* ── MobileBottomBar ── */

export const MobileTabBar = styled.div<{ $expanded: boolean }>`
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: ${({ $expanded }) => ($expanded ? '582px' : '120px')};
    z-index: 10;
    display: flex;
    flex-direction: column;
`;

export const MobileBottomBarShadowWrapper = styled.div`
    box-shadow: 0px -2px 10px #E8EBFF;
    background-color: transparent;
    border-radius: 24px 24px 0 0;
    flex-shrink: 0;
`;

export const MobileBottomBarStyled = styled.div<{ $expanded: boolean }>`
    box-sizing: border-box;
    position: relative;
    left: 0;
    right: 0;
    width: 100%;
    height: ${({ $expanded }) => ($expanded ? '108px' : '120px')};
    padding: ${({ $expanded }) => ($expanded ? '36px 0 20px' : '24px 0 48px')};
    background-color: rgba(255, 255, 255, 0.9);
    border-bottom: ${({ $expanded }) => ($expanded ? '1px solid #E8EBFF' : 'none')};
    border-radius: 24px 24px 0 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    isolation: isolate;
    touch-action: none;
    user-select: none;
    transition: height 0.3s ease, padding 0.3s ease;
`;

export const MobileBottomBarHandle = styled.div`
    position: absolute;
    width: 36px;
    height: 0;
    left: calc(50% - 18px);
    top: 18px;
    border: 2px solid #D8DBFF;
    border-radius: 2px;
    z-index: 1;
`;

export const MobileBottomButtonWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    -ms-overflow-style: none;
    scrollbar-width: none;

    &::-webkit-scrollbar { display: none; }
`;

export const MobileBottomButtons = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0 24px;
    gap: 12px;
    width: max-content;
`;

export const MobileIconButton = styled('button')<{ $active?: boolean }>`
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 12px 18px;
    width: 74px;
    height: 48px;
    border: 1px solid transparent;
    background: ${({ $active }) =>
      $active
        ? 'linear-gradient(#F0F4FF, #F0F4FF) padding-box, linear-gradient(180deg, #AACDFF 0%, #5F84FF 100%) border-box'
        : 'linear-gradient(#FFFFFF, #FFFFFF) padding-box, linear-gradient(180deg, #AACDFF 0%, #5F84FF 100%) border-box'};
    border-radius: 24px;
    cursor: pointer;
    flex-shrink: 0;
    touch-action: auto;

    &:hover {
        background: linear-gradient(#F5F5F5, #F5F5F5) padding-box, linear-gradient(180deg, #AACDFF 0%, #5F84FF 100%) border-box;
    }
`;

export const MobileTextButton = styled('button')<{ $variant?: 'default' | 'styled-outlined' }>`
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 12px 18px;
    height: 48px;
    white-space: nowrap;
    border: 1px solid transparent;
    background: ${({ $variant }) =>
      $variant === 'styled-outlined'
        ? 'linear-gradient(#F7F8FF, #F7F8FF) padding-box, linear-gradient(110deg, #1A00E2 28.5%, #FF7544 86.82%) border-box'
        : 'linear-gradient(#FFFFFF, #FFFFFF) padding-box, linear-gradient(180deg, #AACDFF 0%, #5F84FF 100%) border-box'};
    border-radius: 24px;
    cursor: pointer;
    flex-shrink: 0;
    touch-action: auto;
    font-family: 'S-Core Dream', sans-serif;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.3px;
    color: #262626;

    &:hover {
        background: ${({ $variant }) =>
          $variant === 'styled-outlined'
            ? 'linear-gradient(#EEF0FF, #EEF0FF) padding-box, linear-gradient(110deg, #1A00E2 28.5%, #FF7544 86.82%) border-box'
            : 'linear-gradient(#F5F5F5, #F5F5F5) padding-box, linear-gradient(180deg, #AACDFF 0%, #5F84FF 100%) border-box'};
    }

    &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
    }
`;

/* ── MobilePartyList (expanded member list) ── */

export const MobilePartyList = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0;
    gap: 18px;
    width: 100%;
    flex: 1;
    background: #FFFFFF;
    overflow: hidden;
    position: relative;
`;

export const MobilePartyListHeader = styled.div`
    width: 306px;
    height: 40px;
    border-radius: 24px;
    flex-shrink: 0;
    position: relative;
    display: flex;
    align-items: center;
`;

export const MobilePartyListHeaderText = styled.span`
    position: absolute;
    left: 24px;
    top: calc(50% - 10px);
    font-family: 'S-Core Dream', sans-serif;
    font-weight: 200;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.3px;
    color: #000000;
`;

export const MobilePartyProfileList = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    padding: 0;
    gap: 24px;
    width: 305px;
    flex: 1;
    overflow-y: scroll;
    -ms-overflow-style: none;
    scrollbar-width: none;

    &::-webkit-scrollbar { display: none; }
`;

export const MobilePartyMemberRow = styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding: 0;
    width: 305px;
    height: 76px;
    flex-shrink: 0;
`;

export const MobilePartyOrderContainer = styled.div`
    position: relative;
    width: 24px;
    height: 50px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

export const MobilePartyOrder = styled.span`
    position: absolute;
    width: 7px;
    height: 13px;
    left: 8.5px;
    top: 37px;
    font-family: 'S-Core Dream', sans-serif;
    font-weight: 300;
    font-size: 11px;
    line-height: 13px;
    color: #434343;
`;

export const MobilePartyProfile = styled.div<{ $isCurrentSpeaker?: boolean }>`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 16px 18px 16px 12px;
    gap: 18px;
    width: 281px;
    height: 76px;
    background: ${({ $isCurrentSpeaker }) => ($isCurrentSpeaker ? '#F7F8FF' : '#FFFFFF')};
    border-radius: 2px 50px 50px 2px;
    transition: background-color 0.2s ease;
`;

export const MobilePartyMemberInfo = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 4px;
    flex: 1;
`;

export const MobilePartyMemberName = styled.span`
    font-family: 'S-Core Dream', sans-serif;
    font-weight: 200;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.3px;
    color: #555555;
    display: flex;
    align-items: center;
    gap: 3px;
`;

export const MobilePartyCurrentUserIndicator = styled.span`
    font-family: 'S-Core Dream', sans-serif;
    font-weight: 200;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.3px;
    color: #555555;
`;

export const MobilePartyGradient = styled.div`
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 40px;
    background: linear-gradient(180deg, rgba(247, 248, 255, 0) 0%, #F7F8FF 100%);
    pointer-events: none;
`;

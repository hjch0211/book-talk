import styled from '@emotion/styled';
import {Alert, Box, Button, ListItem} from '@mui/material';

export const DebateContainer = styled.div`
    position: relative;
    width: 100%;
    height: 100vh;
    background: #FFFFFF;
`;

export const NavigationBar = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: flex-start;
    padding: 80px 127px 40px 120px;
    gap: 10px;
    position: absolute;
    width: 100%;
    height: 180px;
    left: 0;
    top: 0;
    background: linear-gradient(360deg, rgba(255, 255, 255, 0) 0%, #FFFFFF 9.13%);
    z-index: 10;
`;

export const NavContent = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0;
    gap: 80px;
    width: 1193px;
    height: 60px;
    flex: none;
    order: 0;
    align-self: stretch;
    flex-grow: 0;
`;

export const DebateTitle = styled.h1`
    width: 918px;
    height: 60px;
    margin: 0;
    font-family: 'S-Core Dream', sans-serif;
    font-weight: 500;
    font-size: 24px;
    line-height: 125%;
    letter-spacing: 0.3px;
    color: #262626;
    flex: none;
    order: 0;
    flex-grow: 0;
    display: flex;
    align-items: center;
`;

export const NavButtonGroup = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 0;
    gap: 12px;
    width: 195px;
    height: 40px;
    flex: none;
    order: 1;
    flex-grow: 0;
`;

export const NavButton = styled(Button)`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 8px 11px;
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

    &:first-of-type {
        width: 98px;
        order: 0;
    }

    &:last-of-type {
        width: 85px;
        order: 1;
    }

    & .MuiButton-startIcon {
        margin-right: 8px;
        margin-left: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 18px;
        height: 24px;
        min-height: 24px;

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

export const MainContent = styled.div`
    display: flex;
    flex-direction: column;
    position: absolute;
    width: 970px;
    left: 120px;
    top: 200px;
`;

export const PresentationArea = styled.div<{ $isChatMode?: boolean }>`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: ${props => props.$isChatMode ? '20px' : '60px 90px 100px 60px'};
    gap: 10px;
    width: 970px;
    min-height: 224px;
    max-height: calc(100vh - 200px - 180px); /* 100vh - top(200px) - chatInput영역(180px) */
    background: #FFFFFF;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
    border-radius: 24px;
    overflow-y: auto;
    position: relative;

    .presentation-editor {
        width: 800px;
        outline: none;
        font-family: 'S-Core Dream', sans-serif;
        font-size: 16px;
        line-height: 1.6;
        color: #262626;

        p.is-editor-empty:first-child::before {
            content: attr(data-placeholder);
            float: left;
            color: #9D9D9D;
            font-family: 'S-Core Dream', sans-serif;
            font-weight: 200;
            font-size: 18px;
            line-height: 180%;
            letter-spacing: 0.3px;
            pointer-events: none;
            height: 0;
        }

        h1 {
            font-family: 'S-Core Dream', sans-serif;
            font-weight: 600;
            font-size: 28px;
            line-height: 1.3;
            color: #262626;
            margin: 0 0 16px 0;
        }

        p {
            margin: 0 0 12px 0;
            font-family: 'S-Core Dream', sans-serif;
            font-weight: 200;
            font-size: 18px;
            line-height: 180%;
            letter-spacing: 0.3px;
            color: #262626;

            &:last-child {
                margin-bottom: 0;
            }
        }

        .presentation-image {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            margin: 16px 0;
        }

        .presentation-video {
            width: 100%;
            max-width: 720px;
            height: 320px;
            border-radius: 8px;
            margin: 16px 0;
        }

        strong {
            font-weight: 600;
        }

        em {
            font-style: italic;
        }

        ul, ol {
            padding-left: 20px;
            margin: 12px 0;
        }

        li {
            margin: 4px 0;
        }

        blockquote {
            border-left: 4px solid #e0e0e0;
            padding-left: 16px;
            margin: 16px 0;
            font-style: italic;
            color: #666;
        }

        code {
            background-color: #f5f5f5;
            padding: 2px 4px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            font-size: 14px;
        }

        pre {
            background-color: #f5f5f5;
            padding: 12px;
            border-radius: 8px;
            overflow-x: auto;
            margin: 16px 0;

            code {
                background-color: transparent;
                padding: 0;
            }
        }

        /* Slash commands 스타일 */

        .tippy-box {
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            border: 1px solid #e0e0e0;
        }

        .tippy-content {
            padding: 0;
        }

        /* Mention 스타일 */

        .mention {
            color: #5A67D8;
            font-weight: 500;
            padding: 2px 4px;
            border-radius: 4px;
            transition: background-color 0.2s;

            &[style*="cursor: pointer"] {
                text-decoration: underline;

                &:hover {
                    background-color: #EBF4FF;
                }
            }
        }
    }
`;

export const ChatInputContainer = styled(Box)`
    position: absolute;
    width: 970px;
    left: 120px;
    min-height: 138px;
    max-height: 400px;
    bottom: 0;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 10px;
    padding: 22px 0;
    background: linear-gradient(360deg, #FFFFFF 89.9%, rgba(255, 255, 255, 0) 100%);
`;

export const ChatInputBox = styled(Box)`
    background-color: #E9E9E9;
    border-radius: 16px;
    padding: 13px 23px;
    width: 820px;
    min-height: 45px;
    max-height: 300px;
    display: flex;
    align-items: center;
    outline: none;

    &:focus,
    &:focus-within {
        outline: none;
    }

    .chat-input-editor {
        font-family: 'S-Core Dream', sans-serif;
        font-size: 18px;
        line-height: 180%;
        width: 775px;
        min-height: 32px;
        max-height: 274px;
        overflow-y: auto;
        color: #262626;

        &::-webkit-scrollbar {
            display: none;
        }

        -ms-overflow-style: none;
        scrollbar-width: none;

        .ProseMirror {
            min-height: 32px;
            outline: none;
        }

        p {
            margin: 0;
            font-family: 'S-Core Dream', sans-serif;
            font-weight: 200;
            font-size: 18px;
            line-height: 180%;
            letter-spacing: 0.3px;
            color: #262626;
        }

        .chat-image {
            max-width: 100%;
            height: auto;
            border-radius: 8px;
            margin: 8px 0;
        }

        .chat-video {
            margin: 8px 0;
            border-radius: 8px;
        }

        .tiptap p.is-editor-empty:first-of-type::before {
            color: #9D9D9D;
            content: attr(data-placeholder);
            float: left;
            height: 0;
            pointer-events: none;
            font-family: 'S-Core Dream', sans-serif;
            font-weight: 200;
            font-size: 18px;
            line-height: 180%;
            letter-spacing: 0.3px;
        }
    }
`;

export const SavedTimeIndicator = styled.div`
    position: relative;
    bottom: 8px;
    display: flex;
    justify-content: flex-end;
    font-family: 'S-Core Dream', sans-serif;
    font-style: normal;
    font-weight: 200;
    font-size: 14px;
    line-height: 20px;
    letter-spacing: 0.3px;
    color: #9D9D9D;
`;

export const MemberListContainer = styled(Box)`
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 2px 0 0 15px;
    isolation: isolate;
    position: absolute;
    width: 280px;
    height: 472px;
    left: 1117px;
    top: 200px;
    background: #FFFFFF;
    border-radius: 24px;
`;

export const MemberListHeader = styled.div`
    width: 265px;
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
    left: 6px;
    top: calc(50% - 20px / 2);
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
    padding: 0;
    gap: 24px;
    width: 265px;
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
    width: 280px;
    height: 40px;
    left: 0;
    top: 432px;
    background: linear-gradient(180deg, rgba(247, 248, 255, 0) 55%, #F7F8FF 100%);
    border-radius: 0 0 24px 24px;
    pointer-events: none;
    flex: none;
    order: 2;
    flex-grow: 0;
    z-index: 2;
`;

export const MemberItem = styled(ListItem)`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0;
    gap: 13px;
    width: 265px;
    height: 76px;
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
    width: 21px;
    height: 100%;
    font-family: 'S-Core Dream', sans-serif;
    font-weight: 300;
    font-size: 11px;
    line-height: 13px;
    color: #434343;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-content: center;
    text-align: center;
`;

export const MemberProfile = styled.div<{ $isCurrentSpeaker?: boolean }>`
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    padding: 16px 42px 16px 24px;
    gap: 10px;
    isolation: isolate;
    width: 230px;
    height: 72px;
    background: ${props => props.$isCurrentSpeaker ? '#F5F5F5' : '#FFFFFF'};
    border-radius: 2px 50px 50px 2px;
    flex: none;
    order: 1;
    flex-grow: 0;
    position: relative;
    transition: background-color 0.2s ease;

    &:hover {
        background-color: rgba(0, 0, 0, 0.04);
        cursor: pointer;
    }
`;

export const MemberProfileBox = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0;
    gap: 14px;
    width: 100%;
    height: 40px;
    flex: none;
    order: 0;
    flex-grow: 0;
`;

export const MemberInfo = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 2px;
    height: 20px;
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
    width: 40px;
    height: 40px;
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

export const MemberMenuButton = styled.div`
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    left: 200px;
    top: calc(50% - 24px / 2);
    cursor: pointer;
    color: #7B7B7B;
    flex: none;
    order: 1;
    flex-grow: 0;
    z-index: 1;

    &:hover {
        color: #262626;
    }
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
`;

export const RaisedHandIcon = styled(Box)`
    position: absolute;
    top: -30px;
    left: 2px;
    transition: opacity 0.3s ease-in-out;
    pointer-events: none;
`;

export const MemberStatus = styled.div`
    font-size: 12px;
    line-height: 150%;
    letter-spacing: 0.3px;
    color: #7B7B7B;
    font-weight: 200;
`;

export const ActionButton = styled(Button)<{ borderColor?: string, backgroundColor?: string }>`
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 16px 32px;
    width: 193px;
    height: 64px;
    left: 1167px;
    top: 742px;
    font-family: 'S-Core Dream', sans-serif;
    font-weight: 200;
    font-size: 18px !important;
    line-height: 180%;
    letter-spacing: 0.3px;
    color: #262626;
    text-transform: none;
    border: none;
    min-width: auto;
    border-radius: 24px;
    isolation: isolate;

    /* Gradient border background */

    &::before {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: 24px;
        padding: 2px;
        background: ${({borderColor}) => borderColor || "linear-gradient(110deg, #1A00E2 28.5%, #FF7544 86.82%)"};
        mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
        mask-composite: exclude;
        -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
        -webkit-mask-composite: destination-out;
        z-index: -1;
    }

    /* Inner background */

    &::after {
        content: '';
        position: absolute;
        inset: 2px;
        background: ${({backgroundColor}) => backgroundColor || "#F7F8FF"};
        border-radius: 22px;
        z-index: -1;
    }

    /* Button shadow */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);

    & .MuiButton-startIcon,
    & .MuiButton-endIcon {
        display: none;
    }

    &:hover:not(:disabled) {
        &::after {
            background: ${({borderColor}) => borderColor || "#BEC3F5"};
            opacity: 0.6;
        }

        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    }

    &:focus {
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
    }

    &:active {
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
    }

    &.Mui-focusVisible {
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
    }

    /* Disabled state */

    &:disabled,
    &.Mui-disabled {
        background: #C4C4C4;
        border: 1px solid #C4C4C4;
        color: #9D9D9D;
        cursor: not-allowed;
        box-shadow: none;

        &::before {
            display: none;
        }

        &::after {
            background: #C4C4C4;
        }

        &:hover {
            background: #C4C4C4;
            box-shadow: none;
        }
    }
`;

export const StyledAlert = styled(Alert)`
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    padding: 6px 16px;
    position: absolute;
    width: 320px;
    height: 48px;
    left: 560px;
    top: 758px;
    background: #8E99FF;
    border-radius: 4px;
    color: #FFFFFF;

    & .MuiAlert-icon {
        color: #FFFFFF;
    }
`;
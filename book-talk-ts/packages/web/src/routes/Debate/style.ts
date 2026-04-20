import styled from '@emotion/styled';
import { Box, Button } from '@mui/material';

export const DebateContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 0px;
    gap: 48px;
    width: 100%;
    background: #FFFFFF;
    height: 100%;
`;

export const ContentRow = styled.div`
    display: flex;
    flex-direction: row;
    gap: 0;
    width: 100%;
    flex: 1;
    min-height: 0;
`;

export const MemberColumn = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0px;
    gap: 60px;
    width: 320px;
    height: 720px;
    flex-shrink: 0;
`;

export const MobileContainer = styled.div`
    position: relative;
    width: 100%;
    height: 100dvh;
    background: #FFFFFF;
    overflow: hidden;
    display: flex;
    flex-direction: column;
`;

export const ChatInputContainer = styled(Box)`
    width: 970px;
    min-height: 138px;
    max-height: 400px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 10px;
    padding: 22px 0;
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

    .chat-input-editor {
        font-family: 'S-Core Dream', sans-serif;
        font-size: 18px;
        line-height: 180%;
        width: 775px;
        min-height: 32px;
        max-height: 274px;
        overflow-y: auto;
        color: #262626;
        outline: none;

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
    bottom: 4px;
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

export const ActionButton = styled(Button)<{ borderColor?: string; backgroundColor?: string }>`
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
        background: ${({ borderColor }) => borderColor || 'linear-gradient(110deg, #1A00E2 28.5%, #FF7544 86.82%)'};
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
        background: ${({ backgroundColor }) => backgroundColor || '#F7F8FF'};
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
            background: ${({ borderColor }) => borderColor || '#BEC3F5'};
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
        pointer-events: auto;
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

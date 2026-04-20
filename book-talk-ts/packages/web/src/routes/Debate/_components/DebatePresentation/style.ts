import styled from '@emotion/styled';
import { Box } from '@mui/material';
import type { RoundType } from '@src/externals/debate';

export const MainContent = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0 32px;
    gap: 10px;
    flex: 1;
    min-height: 0;
`;

export const PresentationSection = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    align-items: end;
`;

export const PresentationArea = styled.div<{ $isChatMode?: boolean; $roundType?: RoundType }>`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: ${(props) => (props.$isChatMode ? '20px' : '60px')};
    gap: 10px;
    width: 100%;
    min-height: 224px;
    height: 100%;
    border: 1px solid #E8EBFF;
    background: #FFF;
    box-shadow: 0px 3px 5px #E8EBFF;
    border-radius: 24px;
    overflow-y: auto;
    overflow-x: hidden;

    .presentation-editor {
        width: 650px;
        outline: none;
        font-family: 'S-Core Dream', sans-serif;
        font-size: 16px;
        line-height: 1.6;
        color: #262626;

        p.is-editor-empty:first-of-type::before {
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

export const ChatInputWrapper = styled(Box)`
    width: 770px;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

/* ── Mobile Presentation Styles ── */

export const MobileBody = styled.div`
    flex: 1;
    padding: 77px 30px 0px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

export const MobilePaper = styled.div`
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 40px 24px 100px;
    width: 100%;
    min-height: 256px;
    background: #FFFFFF;
    border: 1px solid #E8EBFF;
    box-shadow: 0px 3px 5px #E8EBFF;
    border-radius: 24px;
    overflow-y: auto;

    .presentation-editor {
        width: 100%;
        outline: none;
        font-family: 'S-Core Dream', sans-serif;
        font-size: 16px;
        line-height: 1.6;
        color: #262626;

        p.is-editor-empty:first-of-type::before {
            content: attr(data-placeholder);
            float: left;
            color: #9D9D9D;
            font-family: 'S-Core Dream', sans-serif;
            font-weight: 200;
            font-size: 16px;
            line-height: 180%;
            letter-spacing: 0.3px;
            pointer-events: none;
            height: 0;
        }

        p {
            margin: 0 0 12px 0;
            font-weight: 200;
            font-size: 16px;
            line-height: 180%;
            letter-spacing: 0.3px;

            &:last-child { margin-bottom: 0; }
        }

        h1 {
            font-weight: 600;
            font-size: 22px;
            line-height: 1.3;
            margin: 0 0 16px 0;
        }
    }
`;

export const MobileLastModifiedRow = styled.div`
    display: flex;
    justify-content: flex-end;
    font-family: 'S-Core Dream', sans-serif;
    font-weight: 200;
    font-size: 12px;
    line-height: 150%;
    letter-spacing: 0.3px;
    color: #434343;
`;

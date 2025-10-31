import {forwardRef, useEffect, useImperativeHandle, useState} from 'react';
import {Box, List, ListItemButton, Paper, Typography} from '@mui/material';
import styled from "@emotion/styled";
import TitleIcon from '@mui/icons-material/Title';
import ImageIcon from '@mui/icons-material/Image';
import YouTubeIcon from '@mui/icons-material/YouTube';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';

interface SlashCommand {
    title: string;
    description: string;
    command: () => void;
}

interface SlashCommandsProps {
    items: SlashCommand[];
    command: (item: SlashCommand) => void;
}

const CommandMenu = styled(Paper)`
    min-width: 120px;
    max-height: 400px;
    overflow-y: auto;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba(0, 0, 0, 0.08);
    z-index: 1000;
    padding: 6px;
`;

const CommandItem = styled(ListItemButton)`
    padding: 10px 12px;
    border-radius: 8px;
    margin-bottom: 2px;
    transition: all 0.15s ease;

    &:hover {
        background-color: #f8f9fa;
    }

    &.selected {
        background-color: #e3f2fd;

        .command-title {
            color: #1976d2;
            font-weight: 400;
        }
    }

    &:last-child {
        margin-bottom: 0;
    }
`;

const IconWrapper = styled(Box)`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 8px;
    background-color: #f5f5f5;
    margin-right: 12px;
    flex-shrink: 0;

    .selected & {
        background-color: #e3f2fd;

        svg {
            color: #1976d2;
        }
    }

    svg {
        font-size: 20px;
        color: #666;
    }
`;

// 명령어별 아이콘 매핑
const getIconForCommand = (title: string) => {
    if (title.includes('h1')) return <TitleIcon/>;
    if (title.includes('img')) return <ImageIcon/>;
    if (title.includes('youtube')) return <YouTubeIcon/>;
    if (title.includes('bold')) return <FormatBoldIcon/>;
    if (title.includes('italic')) return <FormatItalicIcon/>;
    return <TitleIcon/>;
};

export const SlashCommands = forwardRef<any, SlashCommandsProps>((props, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const selectItem = (index: number) => {
        const item = props.items[index];
        if (item) {
            props.command(item);
        }
    };

    const upHandler = () => {
        setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
    };

    const downHandler = () => {
        setSelectedIndex((selectedIndex + 1) % props.items.length);
    };

    const enterHandler = () => {
        selectItem(selectedIndex);
    };

    useEffect(() => setSelectedIndex(0), [props.items]);

    useImperativeHandle(ref, () => ({
        onKeyDown: ({event}: { event: KeyboardEvent }) => {
            if (event.key === 'ArrowUp') {
                upHandler();
                return true;
            }

            if (event.key === 'ArrowDown') {
                downHandler();
                return true;
            }

            if (event.key === 'Enter') {
                enterHandler();
                return true;
            }

            return false;
        },
    }));

    return (
        <CommandMenu>
            <List dense disablePadding>
                {props.items.length ? (
                    props.items.map((item, index) => (
                        <CommandItem
                            key={index}
                            className={index === selectedIndex ? 'selected' : ''}
                            onClick={() => selectItem(index)}
                        >
                            <IconWrapper>
                                {getIconForCommand(item.title)}
                            </IconWrapper>
                            <Box sx={{flex: 1, minWidth: 0}}>
                                <Typography
                                    className="command-title"
                                    sx={{
                                        fontSize: '14px',
                                        fontWeight: 500,
                                        color: '#333',
                                        lineHeight: 1.4,
                                    }}
                                >
                                    {item.title}
                                </Typography>
                                <Typography
                                    sx={{
                                        fontSize: '12px',
                                        color: '#666',
                                        lineHeight: 1.3,
                                        marginTop: '2px',
                                    }}
                                >
                                    {item.description}
                                </Typography>
                            </Box>
                        </CommandItem>
                    ))
                ) : (
                    <CommandItem>
                        <Typography sx={{fontSize: '14px', color: '#999'}}>
                            검색 결과가 없습니다
                        </Typography>
                    </CommandItem>
                )}
            </List>
        </CommandMenu>
    );
});

SlashCommands.displayName = 'SlashCommands';
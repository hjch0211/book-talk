import {forwardRef, useEffect, useImperativeHandle, useState} from 'react';
import {List, ListItemButton, ListItemText, Paper} from '@mui/material';
import styled from "@emotion/styled";

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
    max-height: 300px;
    overflow-y: auto;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 1000;
`;

const CommandItem = styled(ListItemButton)`
    padding: 8px 16px;

    &:hover {
        background-color: #f5f5f5;
    }

    &.selected {
        background-color: #e3f2fd;
    }
`;

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
            <List dense>
                {props.items.length ? (
                    props.items.map((item, index) => (
                        <CommandItem
                            key={index}
                            className={index === selectedIndex ? 'selected' : ''}
                            onClick={() => selectItem(index)}
                        >
                            <ListItemText
                                primary={item.title}
                                secondary={item.description}
                                primaryTypographyProps={{
                                    fontSize: '14px',
                                    fontWeight: 500,
                                }}
                                secondaryTypographyProps={{
                                    fontSize: '12px',
                                    color: '#666',
                                }}
                            />
                        </CommandItem>
                    ))
                ) : (
                    <CommandItem>
                        <ListItemText primary="검색 결과가 없습니다"/>
                    </CommandItem>
                )}
            </List>
        </CommandMenu>
    );
});

SlashCommands.displayName = 'SlashCommands';
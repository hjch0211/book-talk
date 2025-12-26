import { styled } from '@mui/material/styles';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

interface MentionItem {
  id: string;
  name: string;
}

interface MentionListProps {
  items: MentionItem[];
  command: (item: MentionItem) => void;
}

const MentionSuggestionsContainer = styled('div')`
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 8px 0;
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
`;

const MentionItemButton = styled('button')<{ $isSelected: boolean }>`
    display: block;
    width: 100%;
    padding: 8px 16px;
    text-align: left;
    border: none;
    background: ${(props) => (props.$isSelected ? '#F7F8FF' : 'none')};
    cursor: pointer;
    font-family: 'S-Core Dream', sans-serif;
    font-size: 14px;
    color: #262626;
    transition: background-color 0.2s;

    &:hover {
        background: #F7F8FF;
    }
`;

export const MentionList = forwardRef<any, MentionListProps>((props, ref) => {
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

  useEffect(() => {
    setSelectedIndex(0);
  }, []);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: any) => {
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
    <MentionSuggestionsContainer>
      {props.items.length ? (
        props.items.map((item, index) => (
          <MentionItemButton
            key={item.id}
            onClick={() => selectItem(index)}
            $isSelected={index === selectedIndex}
          >
            @{item.name}
          </MentionItemButton>
        ))
      ) : (
        <div style={{ padding: '8px 16px', color: '#999' }}>참여자를 찾을 수 없습니다</div>
      )}
    </MentionSuggestionsContainer>
  );
});

MentionList.displayName = 'MentionList';

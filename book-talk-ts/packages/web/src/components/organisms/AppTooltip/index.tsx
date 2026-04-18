import { MoreVert } from '@mui/icons-material';
import { Menu } from '@mui/material';
import { createContext, type MouseEvent, type ReactNode, useContext, useState } from 'react';
import {
  ItemLabel,
  menuListSx,
  menuPaperSx,
  StyledMenuItem,
  TriggerButton,
  TriggerWrapper,
} from './style.ts';

interface AppTooltipContextValue {
  onClose: () => void;
}

const AppTooltipContext = createContext<AppTooltipContextValue | null>(null);

function useAppTooltipContext() {
  const ctx = useContext(AppTooltipContext);
  if (!ctx) throw new Error('AppTooltip.Item must be used within AppTooltip');
  return ctx;
}

interface AppTooltipProps {
  children: ReactNode;
  trigger?: ReactNode;
}

function AppTooltipRoot({ children, trigger }: AppTooltipProps) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      {trigger ? (
        <TriggerWrapper onClick={handleOpen}>{trigger}</TriggerWrapper>
      ) : (
        <TriggerButton onClick={handleOpen}>
          <MoreVert />
        </TriggerButton>
      )}
      <AppTooltipContext.Provider value={{ onClose: handleClose }}>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          slotProps={{ paper: { sx: menuPaperSx } }}
          MenuListProps={{ sx: menuListSx }}
        >
          {children}
        </Menu>
      </AppTooltipContext.Provider>
    </>
  );
}

interface AppTooltipItemProps {
  children: ReactNode;
  onClick: () => void;
  show?: boolean;
}

function AppTooltipItem({ children, onClick, show = true }: AppTooltipItemProps) {
  const { onClose } = useAppTooltipContext();

  if (!show) return null;

  const handleClick = () => {
    onClick();
    onClose();
  };

  return (
    <StyledMenuItem onClick={handleClick}>
      <ItemLabel variant="captionM">{children}</ItemLabel>
    </StyledMenuItem>
  );
}

export const AppTooltip = Object.assign(AppTooltipRoot, {
  Item: AppTooltipItem,
});

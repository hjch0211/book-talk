import type { SxProps, Theme } from '@mui/material';
import type { ReactNode } from 'react';
import { StyledContainer, StyledWrapper } from './style.ts';

interface Props {
  children: ReactNode;
  bgColor?: string;
  sx?: SxProps<Theme>;
}

const PageContainer = ({ children, bgColor, sx }: Props) => {
  return (
    <StyledWrapper bgColor={bgColor} sx={sx}>
      <StyledContainer maxWidth={false} disableGutters>
        {children}
      </StyledContainer>
    </StyledWrapper>
  );
};

export default PageContainer;

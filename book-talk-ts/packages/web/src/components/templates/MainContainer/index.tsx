import { type ReactNode } from 'react';
import { StyledContainer } from './style.ts';

interface Props {
  children: ReactNode;
}

const MainContainer = ({ children }: Props) => {
  return (
    <StyledContainer maxWidth={false} disableGutters>
      {children}
    </StyledContainer>
  );
};

export default MainContainer;

import type { ReactNode } from 'react';
import { StyledContainer, StyledFixedWrapper, StyledRelativeWrapper } from './style.ts';

interface Props {
  children: ReactNode;
  bgColor?: string;
  isRelative?: boolean;
}

const PageContainer = ({ children, bgColor, isRelative }: Props) => {
  const Wrapper = isRelative ? StyledRelativeWrapper : StyledFixedWrapper;

  return (
    <Wrapper bgColor={bgColor}>
      <StyledContainer maxWidth={false} disableGutters>
        {children}
      </StyledContainer>
    </Wrapper>
  );
};

export default PageContainer;

import type { ReactNode } from 'react';
import { StyledPageContainer } from './style.ts';

interface PageWrapperProps {
  children: ReactNode;
  bgColor?: string;
}

const PageContainer = ({ children, bgColor }: PageWrapperProps) => {
  return <StyledPageContainer bgColor={bgColor}>{children}</StyledPageContainer>;
};

export default PageContainer;

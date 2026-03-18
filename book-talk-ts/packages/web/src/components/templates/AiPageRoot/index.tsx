import type { ReactNode } from 'react';
import { Background } from '../AiBackground';
import { AiPageRootWrapper } from './style';

interface Props {
  children: ReactNode;
}

export function AiPageRoot({ children }: Props) {
  return (
    <AiPageRootWrapper>
      <Background />
      {children}
    </AiPageRootWrapper>
  );
}
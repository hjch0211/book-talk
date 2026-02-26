import type { ReactNode } from 'react';
import { type AppFieldMessageType, StyledFieldMessage } from './style';

interface AppFieldMessageProps {
  type: AppFieldMessageType;
  children: ReactNode;
}

export function AppFieldMessage({ type, children }: AppFieldMessageProps) {
  return <StyledFieldMessage $type={type}>{children}</StyledFieldMessage>;
}

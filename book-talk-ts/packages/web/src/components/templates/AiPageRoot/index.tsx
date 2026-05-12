import type { ReactNode } from 'react';
import { AiPageRootWrapper } from './style';

interface Props {
  children: ReactNode;
}

export function AiPageRoot({ children }: Props) {
  return (
    <AiPageRootWrapper>
      <svg
        style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
        aria-hidden="true"
      >
        <defs>
          <filter id="crayon-border" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.08"
              numOctaves="5"
              seed="3"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="12"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>
      {children}
    </AiPageRootWrapper>
  );
}

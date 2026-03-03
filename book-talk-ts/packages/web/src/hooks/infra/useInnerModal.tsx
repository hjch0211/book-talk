import { InnerModalContext } from '@src/providers/InnerModalProvider';
import { useContext } from 'react';

export const useInnerModal = () => {
  const context = useContext(InnerModalContext);
  if (!context) {
    throw new Error('useInnerModal must be used within InnerModalProvider');
  }
  return context;
};

import { createContext, type ReactNode, useCallback, useMemo, useState } from 'react';
import { Toast } from '../components/organisms/Toast';

interface ToastMethods {
  success: (message: string) => void;
  error: (message: string) => void;
  warning: (message: string) => void;
  info: (message: string) => void;
  show: (message: string) => void;
}

interface ToastContextType {
  toast: ToastMethods;
  close: () => void;
}

export const ToastContext = createContext<ToastContextType | null>(null);

interface ToastProviderProps {
  children: ReactNode;
}

/**
 * @name ToastProvider
 * @description 전역 토스트 알림 상태 관리 및 표시 제공
 * @external none
 */
export const ToastProvider = ({ children }: ToastProviderProps) => {
  const [message, setMessage] = useState<string | null>(null);

  const close = useCallback(() => {
    setMessage(null);
  }, []);

  const toast = useMemo<ToastMethods>(
    () => ({
      success: (msg: string) => setMessage(msg),
      error: (msg: string) => setMessage(msg),
      warning: (msg: string) => setMessage(msg),
      info: (msg: string) => setMessage(msg),
      show: (msg: string) => setMessage(msg),
    }),
    []
  );

  return (
    <ToastContext.Provider value={{ toast, close }}>
      {children}
      {message && <Toast open={true} message={message} duration={3000} onClose={close} />}
    </ToastContext.Provider>
  );
};

import { BaseGlobalStyle, TiptapGlobalStyle } from '@src/GlobalStyle.tsx';
import { AppRoutes } from '@src/routes/AppRoutes.tsx';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import {
  DesignSystemProvider,
  ModalProvider,
  QueryClientProvider,
  ToastProvider,
} from './providers';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BaseGlobalStyle />
    <TiptapGlobalStyle />
    <BrowserRouter>
      <DesignSystemProvider>
        <QueryClientProvider>
          <ToastProvider>
            <ModalProvider>
              <AppRoutes />
            </ModalProvider>
          </ToastProvider>
        </QueryClientProvider>
      </DesignSystemProvider>
    </BrowserRouter>
  </StrictMode>
);

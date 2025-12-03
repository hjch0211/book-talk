import { createRoot } from 'react-dom/client';
import './index.css';
import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import {
  DesignSystemProvider,
  ModalProvider,
  QueryClientProvider,
  ToastProvider,
} from './providers';
import { AppRoutes } from './routes';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
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

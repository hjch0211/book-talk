import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { BaseGlobalStyle, TiptapGlobalStyle } from '@src/GlobalStyle.tsx';
import DevNavigator from '@src/components/organisms/DevNavigator';
import { AppRoutes } from '@src/routes/AppRoutes.tsx';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import {
  DesignSystemProvider,
  InnerModalProvider,
  ModalProvider,
  QueryClientProvider,
  ToastProvider,
} from './providers';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BaseGlobalStyle />
    <TiptapGlobalStyle />
    <BrowserRouter>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DesignSystemProvider>
          <QueryClientProvider>
            <ToastProvider>
              <InnerModalProvider>
                <ModalProvider>
                  <AppRoutes />
                  <DevNavigator />
                </ModalProvider>
              </InnerModalProvider>
            </ToastProvider>
          </QueryClientProvider>
        </DesignSystemProvider>
      </LocalizationProvider>
    </BrowserRouter>
  </StrictMode>
);

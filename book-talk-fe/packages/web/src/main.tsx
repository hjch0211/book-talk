import { createRoot } from 'react-dom/client';
import './index.css';
import { StrictMode } from 'react';
import { MuiThemeProvider, TanStackQueryProvider } from './providers';
import { AppRoutes } from './routes';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MuiThemeProvider>
      <TanStackQueryProvider>
        <AppRoutes />
      </TanStackQueryProvider>
    </MuiThemeProvider>
  </StrictMode>
);

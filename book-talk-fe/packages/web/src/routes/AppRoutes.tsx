import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ModalProvider } from '../providers';
import { DebateFull, DebatePage, MainPage, NotFound } from './index.ts';

export function AppRoutes() {
  return (
    <BrowserRouter>
      <ModalProvider>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/debate/:debateId" element={<DebatePage />} />
          <Route path="/debate-full" element={<DebateFull />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ModalProvider>
    </BrowserRouter>
  );
}

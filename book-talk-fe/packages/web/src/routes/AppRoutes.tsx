import { Route, Routes } from 'react-router-dom';
import { DebateFull, DebatePage, MainPage, NotFound } from './index.ts';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/debate/:debateId" element={<DebatePage />} />
      <Route path="/debate-full" element={<DebateFull />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

import { DebateExpired } from '@src/routes/_Error/DebateExpired';
import { LogInPage } from '@src/routes/LogIn';
import { Route, Routes } from 'react-router-dom';
import { DebateFull, DebatePage, LandingPage, MainPage, NotFound } from './index.ts';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<MainPage />} />
      <Route path="/sign-in" element={<LogInPage />} />
      <Route path="/debate/:debateId" element={<DebatePage />} />
      <Route path="/debate-full" element={<DebateFull />} />
      <Route path="/debate-expired" element={<DebateExpired />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

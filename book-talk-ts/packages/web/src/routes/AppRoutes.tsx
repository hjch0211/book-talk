import { DebateExpired } from '@src/routes/_Error/DebateExpired';
import { Route, Routes } from 'react-router-dom';
import { AiChatPage, AiChatRoomPage, DebateFull, DebatePage, MainPage, NotFound } from './index.ts';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/debate/:debateId" element={<DebatePage />} />
      <Route path="/debate-full" element={<DebateFull />} />
      <Route path="/debate-expired" element={<DebateExpired />} />
      <Route path="/ai-chat" element={<AiChatPage />} />
      <Route path="/ai-chat/:chatId" element={<AiChatRoomPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

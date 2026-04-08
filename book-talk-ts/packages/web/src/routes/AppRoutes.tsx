import { env } from '@src/configs/env.ts';
import { DebateExpired } from '@src/routes/_Error/DebateExpired';
import { DebateFull } from '@src/routes/_Error/DebateFull';
import { NotFound } from '@src/routes/_Error/NotFound';
import { PrivacyPage } from '@src/routes/_Policy/Privacy';
import { TermsOfUsePage } from '@src/routes/_Policy/TermsOfUse';
import { ForgotPasswordPage } from '@src/routes/_Sign/ForgotPassword';
import { GoogleCallbackPage } from '@src/routes/_Sign/GoogleCallback';
import { SignInPage } from '@src/routes/_Sign/SignIn';
import { SignUpPage } from '@src/routes/_Sign/SignUp';
import { AiChatPage } from '@src/routes/AiChat';
import { AiChatRoomPage } from '@src/routes/AiChatRoom';
import { DebatePage } from '@src/routes/Debate';
import { HomePage } from '@src/routes/Home';
import { LandingPage } from '@src/routes/Landing';
import { MyPage } from '@src/routes/MyPage';
import { Route, Routes } from 'react-router-dom';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/sign-up" element={<SignUpPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/auth/callback" element={<GoogleCallbackPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms-of-use" element={<TermsOfUsePage />} />
      <Route path="/my-page" element={<MyPage />} />
      <Route path="/debate/:debateId" element={<DebatePage />} />
      {env.APP_ENV === 'development' && (
        <>
          <Route path="/ai-chat" element={<AiChatPage />} />
          <Route path="/ai-chat/:chatId" element={<AiChatRoomPage />} />
        </>
      )}
      <Route path="/debate-full" element={<DebateFull />} />
      <Route path="/debate-expired" element={<DebateExpired />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

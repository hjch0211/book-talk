import { saveTokens } from '@src/externals/client.ts';
import { useEffect, useEffectEvent } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export function GoogleCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleRedirect = useEffectEvent(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');
    const error = searchParams.get('error');

    if (accessToken && refreshToken) {
      saveTokens(accessToken, refreshToken);
      navigate('/home', { replace: true });
    } else {
      navigate(`/sign-in?error=${error ?? 'unknown'}`, { replace: true });
    }
  });

  useEffect(() => {
    handleRedirect();
  }, []);

  return null;
}

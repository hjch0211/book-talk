import { meQueryOption } from '@src/externals/account';
import { useToast } from '@src/hooks';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useEffectEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export type MainTab = 'debate-management' | 'profile-settings';

export function useMyPage() {
  const navigate = useNavigate();
  const [mainTab, setMainTab] = useState<MainTab>('debate-management');
  const { data: me, isLoading } = useQuery(meQueryOption);
  const { toast } = useToast();

  const redirectSignInPage = useEffectEvent(() => {
    navigate('/sign-in', {
      state: { redirect: window.location.pathname + window.location.search },
    });
  });

  useEffect(() => {
    if (!me && !isLoading) {
      redirectSignInPage();
    }
  }, [me, isLoading]);

  return {
    me,
    mainTab,
    setMainTab,
    navigateHome: () => navigate('/home'),
  };
}

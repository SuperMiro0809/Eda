'use client';

import { useState, useEffect } from 'react';

import { useRouter, useSearchParams } from '@/routes/hooks';

import { CONFIG } from '@/global-config';

import { SplashScreen } from '@/components/loading-screen';

import { useAuth } from '../hooks/use-auth';

// ----------------------------------------------------------------------

interface GuestGuardProps {
  children: React.ReactNode;
}

export function GuestGuard({ children }: GuestGuardProps) {
  const router = useRouter();

  const { isLoading, isAuthenticated } = useAuth();

  const searchParams = useSearchParams();
  const returnTo = searchParams.get('returnTo') || CONFIG.auth.redirectPath;

  const [isChecking, setIsChecking] = useState(true);

  const checkPermissions = async () => {
    if (isLoading) {
      return;
    }

    if (isAuthenticated) {
      router.replace(returnTo);
      return;
    }

    setIsChecking(false);
  };

  useEffect(() => {
    checkPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isLoading]);

  if (isChecking) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}

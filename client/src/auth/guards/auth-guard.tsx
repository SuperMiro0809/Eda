'use client';

import { useState, useEffect } from 'react';

import { paths } from '@/routes/paths';
import { useRouter, usePathname } from '@/routes/hooks';

import { SplashScreen } from '@/components/loading-screen';

import { useAuth } from '../hooks/use-auth';

// ----------------------------------------------------------------------

export function AuthGuard({
  children
}: Readonly<{
  children: React.ReactNode;
}>
) {
  const router = useRouter();
  const pathname = usePathname();

  const { isAuthenticated, isLoading } = useAuth();

  const [isChecking, setIsChecking] = useState(true);

  const createRedirectPath = (currentPath: string) => {
    const queryString = new URLSearchParams({ returnTo: pathname }).toString();
    return `${currentPath}?${queryString}`;
  };

  const checkPermissions = async () => {
    if (isLoading) {
      return;
    }

    if (!isAuthenticated) {
      const redirectPath = createRedirectPath(paths.auth.login);

      router.replace(redirectPath);

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

'use client';

import { useState, useCallback, useMemo } from 'react';

import { AuthContext } from './auth-context';
import type { User } from '../types';

// ----------------------------------------------------------------------

// Mock user for development
const MOCK_USER: User = {
  id: 'user-001',
  displayName: 'Demo User',
  email: 'demo@eda.bg',
  photoURL: undefined,
};

// ----------------------------------------------------------------------

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(() => {
    setIsLoading(true);
    // Simulate login delay
    setTimeout(() => {
      setUser(MOCK_USER);
      setIsLoading(false);
    }, 500);
  }, []);

  const logout = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setUser(null);
      setIsLoading(false);
    }, 300);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
    }),
    [user, isLoading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';

import { getUserAction, loginAction, registerAction, logoutAction } from '@/actions/auth';

import { AuthContext } from './auth-context';
import type { User } from '../types';

// ----------------------------------------------------------------------

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const res = await getUserAction();

        if (res?.error) throw res.error;

        const resData = res.data;

        setUser(resData?.user ?? null);
      } catch (error) {
        console.error(error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    init();
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const reqData = {
      email,
      password
    };

    const res = await loginAction(reqData);

    if (res?.error) throw res.error;

    const resData = res.data;
    setUser(resData?.user ?? null);
  }, []);

  const register = useCallback(async (firstName: string, familyName: string, email: string, password: string) => {
    const reqData = {
      firstName,
      familyName,
      email,
      password
    };

    const res = await registerAction(reqData);

    if (res?.error) throw res.error;

    const resData = res.data;
    setUser(resData?.user ?? null);
  }, []);

  const logout = useCallback(async () => {
    await logoutAction();
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const res = await getUserAction();

      if (res?.error) throw res.error;

      const resData = res.data;
      setUser(resData?.user ?? null);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const updateUser = useCallback((updatedUser: User) => {
    setUser(updatedUser);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
      refreshUser,
      updateUser,
    }),
    [user, isLoading, login, register, logout, refreshUser, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

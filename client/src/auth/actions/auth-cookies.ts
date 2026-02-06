'use server';

import { cookies } from 'next/headers';

// ----------------------------------------------------------------------

const TOKEN_KEY = 'auth_token';
const TOKEN_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function setAuthToken(token: string): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(TOKEN_KEY, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: TOKEN_MAX_AGE,
    path: '/',
  });
}

export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(TOKEN_KEY)?.value || null;
}

export async function removeAuthToken(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(TOKEN_KEY);
}

'use client';

import { AuthLayout } from '@/layouts/auth';
import { GuestGuard } from '@/auth/guards';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <GuestGuard>
      <AuthLayout>{children}</AuthLayout>
    </GuestGuard>
  );
}
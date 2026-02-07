import { AuthGuard } from '@/auth/guards';

// ----------------------------------------------------------------------

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard>{children}</AuthGuard>
  );
}
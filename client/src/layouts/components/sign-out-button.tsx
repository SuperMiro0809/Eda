import { useCallback } from 'react';
// import { useAuth0 } from '@auth0/auth0-react';

import Button, { ButtonProps } from '@mui/material/Button';
import { SxProps, Theme } from '@mui/material/styles';

import { useRouter } from '@/routes/hooks';

import { CONFIG } from '@/global-config';

import { toast } from '@/components/snackbar';

// import { useAuthContext } from 'src/auth/hooks';
// import { signOut as jwtSignOut } from 'src/auth/context/jwt/action';
// import { signOut as amplifySignOut } from 'src/auth/context/amplify/action';
// import { signOut as supabaseSignOut } from 'src/auth/context/supabase/action';
// import { signOut as firebaseSignOut } from 'src/auth/context/firebase/action';

// ----------------------------------------------------------------------

// const signOut =
//   (CONFIG.auth.method === 'supabase' && supabaseSignOut) ||
//   (CONFIG.auth.method === 'firebase' && firebaseSignOut) ||
//   (CONFIG.auth.method === 'amplify' && amplifySignOut) ||
//   jwtSignOut;

// ----------------------------------------------------------------------

export interface SignOutButtonProps extends ButtonProps {
  onClose?: () => void;
  sx?: SxProps<Theme>;
}

export function SignOutButton({ onClose, sx, ...other }: SignOutButtonProps) {
  const router = useRouter();

  // const { checkUserSession } = useAuthContext();

  // const { logout: signOutAuth0 } = useAuth0();

  // const handleLogout = useCallback(async () => {
  //   try {
  //     await signOut();
  //     await checkUserSession?.();

  //     onClose?.();
  //     router.refresh();
  //   } catch (error) {
  //     console.error(error);
  //     toast.error('Unable to logout!');
  //   }
  // }, [checkUserSession, onClose, router]);

   const handleLogout = useCallback(async () => {
   
  }, []);

  // const handleLogoutAuth0 = useCallback(async () => {
  //   try {
  //     await signOutAuth0();

  //     onClose?.();
  //     router.refresh();
  //   } catch (error) {
  //     console.error(error);
  //     toast.error('Unable to logout!');
  //   }
  // }, [onClose, router, signOutAuth0]);

  const handleLogoutAuth0 = useCallback(async () => {
   
  }, []);

  return (
    <Button
      fullWidth
      // @ts-expect-error
      variant="soft"
      size="large"
      color="error"
      onClick={CONFIG.auth.method === 'auth0' ? handleLogoutAuth0 : handleLogout}
      sx={sx}
      {...other}
    >
      Logout
    </Button>
  );
}

'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { alpha, SxProps } from '@mui/material/styles';

import { paths } from '@/routes/paths';
import { RouterLink } from '@/routes/components';

import { useAuth } from '@/auth/hooks/use-auth';
import { Iconify } from '@/components/iconify';

// ----------------------------------------------------------------------

export function NavAuthCard({ sx, ...other }: { sx: SxProps }) {
  const { user, isAuthenticated, logout } = useAuth();

  // Not authenticated - show login prompt
  if (!isAuthenticated) {
    return (
      <Box
        sx={[
          {
            mx: 2,
            mb: 3,
            p: 2.5,
            borderRadius: 2,
            textAlign: 'center',
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...other}
      >
        <Box
          sx={{
            width: 48,
            height: 48,
            mx: 'auto',
            mb: 2,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
            color: 'primary.main',
          }}
        >
          <Iconify icon="solar:user-circle-bold" width={28} />
        </Box>

        <Typography
          variant="subtitle2"
          sx={{ mb: 0.5, color: 'var(--layout-nav-text-primary-color)' }}
        >
          Sign in to save chats
        </Typography>

        <Typography
          variant="caption"
          sx={{
            display: 'block',
            mb: 2,
            color: 'var(--layout-nav-text-disabled-color)',
            lineHeight: 1.5,
          }}
        >
          Keep your conversation history and get personalized help
        </Typography>

        <Button
          component={RouterLink}
          href={paths.auth.login}
          fullWidth
          variant="contained"
          color="primary"
          startIcon={<Iconify icon="solar:login-2-bold" width={20} />}
        >
          Sign In
        </Button>
      </Box>
    );
  }

  // Authenticated - show user info
  return (
    <Box
      sx={[
        {
          mx: 2,
          mb: 3,
          p: 2,
          borderRadius: 2,
          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Avatar
          // src={user?.photoURL}
          alt={user?.full_name}
          sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}
        >
          {user?.full_name?.charAt(0).toUpperCase()}
        </Avatar>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="subtitle2"
            noWrap
            sx={{ color: 'var(--layout-nav-text-primary-color)' }}
          >
            {user?.full_name}
          </Typography>

          <Typography
            variant="caption"
            noWrap
            sx={{ color: 'var(--layout-nav-text-disabled-color)' }}
          >
            {user?.email}
          </Typography>
        </Box>

        <Button
          size="small"
          color="inherit"
          onClick={logout}
          sx={{
            minWidth: 'auto',
            p: 0.75,
            color: 'var(--layout-nav-text-secondary-color)',
            '&:hover': {
              bgcolor: (theme) => alpha(theme.palette.grey[500], 0.16),
            },
          }}
        >
          <Iconify icon="solar:logout-2-outline" width={20} />
        </Button>
      </Box>
    </Box>
  );
}

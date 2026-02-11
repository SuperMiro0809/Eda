'use client';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { alpha, SxProps, Theme } from '@mui/material/styles';

import { paths } from '@/routes/paths';
import { RouterLink } from '@/routes/components';

import { useTranslate } from '@/locales';
import { useAuth } from '@/auth/hooks/use-auth';
import { Iconify } from '@/components/iconify';
import { AnimateBorder } from '@/components/animate';

import { CONFIG } from '@/global-config';

// ----------------------------------------------------------------------

interface NavAuthCardProps {
  sx?: SxProps<Theme>;
  mini?: boolean;
}

export function NavAuthCard({ sx, mini = false, ...other }: NavAuthCardProps) {
  const { t } = useTranslate();
  const { user, isAuthenticated, logout } = useAuth();

  // Mini version for collapsed nav
  if (mini) {
    if (!isAuthenticated) {
      return (
        <Box
          sx={[
            {
              display: 'flex',
              justifyContent: 'center',
              pb: 2,
            },
            ...(Array.isArray(sx) ? sx : [sx]),
          ]}
          {...other}
        >
          <Tooltip title={t('sign-in')} placement="right">
            <IconButton
              component={RouterLink}
              href={paths.auth.login}
              sx={{
                width: 40,
                height: 40,
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                color: 'primary.main',
                '&:hover': {
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
                },
              }}
            >
              <Iconify icon="solar:login-2-bold" width={20} />
            </IconButton>
          </Tooltip>
        </Box>
      );
    }

    return (
      <Box
        sx={[
          {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
            pb: 2,
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
        {...other}
      >
        <Tooltip title={user?.full_name} placement="right">
          <Box
            component={RouterLink}
            href={paths.user.profile}
            sx={{ textDecoration: 'none', cursor: 'pointer' }}
          >
            <AnimateBorder
              sx={{ p: '2px', borderRadius: '50%', width: 40, height: 40 }}
              slotProps={{
                primaryBorder: { size: 50, width: '1px', sx: { color: 'primary.main' } },
                secondaryBorder: { sx: { color: 'warning.main' } },
              }}
            >
              <Avatar
                alt={user?.full_name}
                src={user?.avatar ? `${CONFIG.assetsDir}/${user.avatar}` : undefined}
                sx={{ width: 1, height: 1, fontSize: 14 }}
              >
                {user?.full_name?.charAt(0).toUpperCase()}
              </Avatar>
            </AnimateBorder>
          </Box>
        </Tooltip>

        <Tooltip title={t('logout')} placement="right">
          <IconButton
            onClick={logout}
            size="small"
            sx={{
              color: 'var(--layout-nav-text-secondary-color)',
              '&:hover': {
                bgcolor: (theme) => alpha(theme.palette.grey[500], 0.16),
              },
            }}
          >
            <Iconify icon="solar:logout-2-outline" width={18} />
          </IconButton>
        </Tooltip>
      </Box>
    );
  }

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
          {t('sign-in-to-save')}
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
          {t('sign-in-benefit')}
        </Typography>

        <Button
          component={RouterLink}
          href={paths.auth.login}
          fullWidth
          variant="contained"
          color="primary"
          startIcon={<Iconify icon="solar:login-2-bold" width={20} />}
        >
          {t('sign-in')}
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
        <Box
          component={RouterLink}
          href={paths.user.profile}
          sx={{
            textDecoration: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            flex: 1,
            minWidth: 0,
          }}
        >
          <AnimateBorder
            sx={{ p: '3px', borderRadius: '50%', width: 44, height: 44 }}
            slotProps={{
              primaryBorder: { size: 60, width: '1px', sx: { color: 'primary.main' } },
              secondaryBorder: { sx: { color: 'warning.main' } },
            }}
          >
            <Avatar
              alt={user?.full_name}
              src={user?.avatar ? `${CONFIG.assetsDir}/${user.avatar}` : undefined}
              sx={{ width: 1, height: 1 }}
            >
              {user?.full_name?.charAt(0).toUpperCase()}
            </Avatar>
          </AnimateBorder>

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

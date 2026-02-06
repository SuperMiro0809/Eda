// @mui
import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// hooks
import { useResponsive } from '@/hooks/use-responsive';
// theme
import { bgGradient } from '@/theme/core/mixins/background';
// components
import { Logo } from '@/components/logo';
// locales
import { useTranslate } from '@/locales';

// ----------------------------------------------------------------------

type AuthLayoutProps = {
  children: React.ReactNode;
  image?: string;
  title?: string;
  subtitle?: string;
};

export function AuthLayout({ children, image, title, subtitle }: AuthLayoutProps) {
  const theme = useTheme();
  const { t } = useTranslate();

  const upMd = useResponsive('up', 'md');

  const defaultTitle = t('welcome_title', { ns: 'auth' });
  const defaultSubtitle = t('welcome_subtitle', { ns: 'auth' });

  const renderLogo = (
    <Logo
      sx={{
        zIndex: 9,
        position: 'absolute',
        m: { xs: 2, md: 5 },
      }}
    />
  );

  const renderContent = (
    <Stack
      sx={{
        width: 1,
        mx: 'auto',
        maxWidth: 480,
        px: { xs: 2, md: 8 },
        py: { xs: 15, md: 30 },
      }}
    >
      {children}
    </Stack>
  );

  const renderSection = (
    <Stack
      flexGrow={1}
      alignItems="center"
      justifyContent="center"
      spacing={2}
      sx={{
        ...bgGradient({
          color: alpha(
            theme.palette.background.default,
            theme.palette.mode === 'light' ? 0.88 : 0.94
          ),
          imgUrl: '/assets/background/overlay_2.jpg',
        }),
      }}
    >
      <Typography variant="h3" sx={{ maxWidth: 480, textAlign: 'center', mb: 0.3 }}>
        {title || defaultTitle}
      </Typography>
      <Typography variant="subtitle1" sx={{ maxWidth: 480, textAlign: 'center', mt: 0.3, mb: 0.3, color: 'text.secondary' }}>
        {subtitle || defaultSubtitle}
      </Typography>

      <Box
        component="img"
        alt="auth"
        src={image || '/assets/illustrations/3.svg'}
        sx={{ maxHeight: 580, mt: 3 }}
      />
    </Stack>
  );

  return (
    <Stack
      component="main"
      direction="row"
      sx={{
        minHeight: '100vh',
      }}
    >
      {renderLogo}

      {upMd && renderSection}

      {renderContent}
    </Stack>
  );
}

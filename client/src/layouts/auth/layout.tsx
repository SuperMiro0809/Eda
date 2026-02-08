// @mui
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
// hooks
import { useResponsive } from '@/hooks/use-responsive';
// components
import { Logo } from '@/components/logo';
import { SettingsButton } from '@/layouts/components/settings-button';
// locales
import { useTranslate } from '@/locales';
import { varAlpha } from 'minimal-shared';

// ----------------------------------------------------------------------

type AuthLayoutProps = {
  children: React.ReactNode;
  image?: string;
  title?: string;
  subtitle?: string;
};

export function AuthLayout({ children, image, title, subtitle }: AuthLayoutProps) {
  const { t } = useTranslate();

  const upMd = useResponsive('up', 'md');

  const defaultTitle = t('welcome_title', { ns: 'auth' });
  const defaultSubtitle = t('welcome_subtitle', { ns: 'auth' });

  const renderLogo = (
    <Logo
      sx={{
        zIndex: 9,
        position: 'absolute',
        top: { xs: 16, md: 40 },
        left: { xs: 16, md: 40 },
      }}
    />
  );

  const renderSettings = (
    <Box
      sx={{
        zIndex: 9,
        position: 'absolute',
        top: { xs: 16, md: 40 },
        right: { xs: 16, md: 40 },
      }}
    >
      <SettingsButton sx={{}} />
    </Box>
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
      sx={(theme) => ({
        ...theme.mixins.bgGradient({
          images: [
            `linear-gradient(0deg, ${varAlpha(theme.vars.palette.background.defaultChannel, 0.92)}, ${varAlpha(theme.vars.palette.background.defaultChannel, 0.92)})`,
            `url(/assets/background/overlay_2.jpg)`,
          ],
        }),
      })}
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
        src={image || '/assets/illustrations/ai-assistant.svg'}
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

      {renderSettings}

      {upMd && renderSection}

      {renderContent}
    </Stack>
  );
}

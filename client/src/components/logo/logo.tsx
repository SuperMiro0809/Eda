import { forwardRef } from 'react';

import { useTheme } from '@mui/material/styles';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';

import { RouterLink } from '@/routes/components';

// ----------------------------------------------------------------------

const Logo = forwardRef(({ disabledLink = false, sx, ...other }, ref) => {
  const theme = useTheme();

  const logo = (
    <Box
      component="img"
      src="/logo/logo_single.svg"
      sx={{ width: 40, height: 40, cursor: 'pointer', filter: 'invert(27%) sepia(99%) saturate(1352%) hue-rotate(203deg) brightness(91%) contrast(88%)', ...sx }}
      {...other}
    />
  );

  if (disabledLink) {
    return logo;
  }

  return (
    <Link component={RouterLink} href="/" sx={{ display: 'contents' }}>
      {logo}
    </Link>
  );
});

// Set display name for the component
Logo.displayName = 'Logo';

export default Logo;

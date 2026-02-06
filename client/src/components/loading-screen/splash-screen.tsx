'use client';

import { Fragment } from 'react';

import Portal from '@mui/material/Portal';
import { styled, SxProps, Theme } from '@mui/material/styles';

import { AnimateLogoZoom } from '../animate';

// ----------------------------------------------------------------------

const LoadingWrapper = styled('div')({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
});

const LoadingContent = styled('div')(({ theme }) => ({
  right: 0,
  bottom: 0,
  zIndex: 9998,
  flexGrow: 1,
  width: '100%',
  height: '100%',
  display: 'flex',
  position: 'fixed',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.vars?.palette.background.default ?? theme.palette.background.default,
}));

// ----------------------------------------------------------------------

interface SplashScreenProps {
  portal?: boolean;
  slotProps?: {
    wrapper?: React.ComponentProps<typeof LoadingWrapper>;
  };
  sx?: SxProps<Theme>;
}

export function SplashScreen({ portal = true, slotProps, sx, ...other }: SplashScreenProps) {
  const PortalWrapper = portal ? Portal : Fragment;

  return (
    <PortalWrapper>
      <LoadingWrapper {...slotProps?.wrapper}>
        <LoadingContent sx={sx} {...other}>
          <AnimateLogoZoom />
        </LoadingContent>
      </LoadingWrapper>
    </PortalWrapper>
  );
}

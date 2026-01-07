'use client';

import { useId } from 'react';
import { Icon, IconProps } from '@iconify/react';
import { mergeClasses } from 'minimal-shared/utils';

import { styled, SxProps, Theme } from '@mui/material/styles';

import { iconifyClasses } from './classes';
import { allIconNames, registerIcons } from './register-icons';

// ----------------------------------------------------------------------

export interface IconifyProps extends IconProps {
  className?: string,
  icon: string,
  sx?: SxProps<Theme>
}

export function Iconify({ className, icon, width = 20, height, sx, ...other }: IconifyProps) {
  const id = useId();

  if (!allIconNames.includes(icon)) {
    console.warn(
      [
        `Icon "${icon}" is currently loaded online, which may cause flickering effects.`,
        `To ensure a smoother experience, please register your icon collection for offline use.`,
        `More information is available at: https://docs.minimals.cc/icons/`,
      ].join('\n')
    );
  }

  registerIcons();

  return (
    <IconRoot
      ssr
      id={id}
      icon={icon}
      className={mergeClasses([iconifyClasses.root, className])}
      sx={[
        {
          width,
          flexShrink: 0,
          height: height ?? width,
          display: 'inline-flex',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    />
  );
}

// ----------------------------------------------------------------------

const IconRoot = styled(Icon)``;

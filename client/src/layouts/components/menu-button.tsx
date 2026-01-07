import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import { SxProps, Theme } from '@mui/material/styles';

import { Iconify } from '@/components/iconify';

// ----------------------------------------------------------------------

export interface MenuButtonProps extends IconButtonProps {
  sx?: SxProps<Theme>;
}

export function MenuButton({ sx, ...other }: MenuButtonProps) {
  return (
    <IconButton sx={sx} {...other}>
      <Iconify icon="custom:menu-duotone" width={24} />
    </IconButton>
  );
}

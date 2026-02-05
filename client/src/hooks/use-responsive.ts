// @mui
import { Breakpoint, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

// ----------------------------------------------------------------------

type Query = 'up' | 'down' | 'between' | 'only';

export function useResponsive(query: Query, start: Breakpoint, end?: Breakpoint): boolean {
  const theme = useTheme();

  const mediaUp = useMediaQuery(theme.breakpoints.up(start));
  const mediaDown = useMediaQuery(theme.breakpoints.down(start));
  const mediaBetween = useMediaQuery(theme.breakpoints.between(start, end as Breakpoint));
  const mediaOnly = useMediaQuery(theme.breakpoints.only(start));

  if (query === 'up') {
    return mediaUp;
  }

  if (query === 'down') {
    return mediaDown;
  }

  if (query === 'between') {
    return mediaBetween;
  }

  if (query === 'only') {
    return mediaOnly;
  }

  return false;
}

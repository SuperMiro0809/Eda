import { useCallback, useState } from 'react';

// ----------------------------------------------------------------------

export default function usePopover() {
  const [anchorEl, setAnchorEl] = useState<null | EventTarget>(null);

  const onOpen = useCallback((event: Event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const onClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  return {
    open: !!anchorEl,
    anchorEl,
    onOpen,
    onClose,
    setAnchorEl
  };
}

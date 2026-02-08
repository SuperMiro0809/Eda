import type { ReactNode } from 'react';

import Button from '@mui/material/Button';
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { useTranslate } from '@/locales';

// ----------------------------------------------------------------------

export interface ConfirmDialogProps extends Omit<DialogProps, 'title' | 'content'> {
  title: ReactNode;
  content?: ReactNode;
  action: ReactNode;
  onClose: (event: MouseEvent) => void;
}

export function ConfirmDialog({ open, title, action, content, onClose, ...other }: ConfirmDialogProps) {
  const { t } = useTranslate();

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose} {...other}>
      <DialogTitle sx={{ pb: 2 }}>{title}</DialogTitle>

      {content && <DialogContent sx={{ typography: 'body2' }}> {content} </DialogContent>}

      <DialogActions>
        {action}

        <Button variant="outlined" color="inherit" onClick={onClose}>
          {t('cancel', { ns: 'common' })}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

import { useBoolean } from 'minimal-shared';
import { MouseEvent, startTransition, useTransition } from 'react';

import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';

import { useTranslate } from '@/locales';

import { useChat } from '@/chat/hooks/use-chat';

import { Iconify } from '@/components/iconify';
import { CustomPopover, usePopover } from '@/components/custom-popover';
import { ConfirmDialog } from '@/components/custom-dialog';
import { toast } from '@/components/snackbar';
import { ChatRenameDialog } from './chat-rename-dialog';

// ----------------------------------------------------------------------

export function ChatNavOptions({ sessionId, sessionTitle }: { sessionId: string, sessionTitle: string }) {
  const { t } = useTranslate();

  const { deleteSession } = useChat();

  const [isPending, startTransition] = useTransition();

  const popover = usePopover();

  const confirmDelete = useBoolean();

  const renameDialog = useBoolean();

  const handleDelete = async (event: MouseEvent) => {
    event.preventDefault();

    startTransition(async () => {
      await deleteSession(sessionId);
      confirmDelete.onFalse();

      toast.success(t('delete-chat-success', { ns: 'messages' }));
    });
  }

  return (
    <>
      <IconButton
        color={popover.open ? 'inherit' : 'default'}
        onClick={(event: React.MouseEvent) => {
          event.preventDefault();
          event.stopPropagation();
          popover.onOpen(event);
        }}
        sx={{ width: 24, height: 24 }}
      >
        <Iconify icon="eva:more-vertical-fill" sx={{ width: 18 }} />
      </IconButton>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        arrow="left-center"
        sx={{ width: 220 }}
      >
        <MenuItem
          onClick={(event) => {
            event.preventDefault();
            renameDialog.onTrue();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:pen-bold" />
          {t('rename', { ns: 'common' })}
        </MenuItem>

        <MenuItem
          onClick={(event) => {
            event.preventDefault();
            confirmDelete.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="solar:trash-bin-trash-bold" />
          {t('delete', { ns: 'common' })}
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirmDelete.value}
        onClose={(event: MouseEvent) => {
          event.preventDefault();
          confirmDelete.onFalse();
        }}
        title={t('delete-chat', { ns: 'chat' })}
        content={t('delete-chat-warning', { ns: 'chat' })}
        action={
          <Button
            variant='contained'
            color='error'
            loading={isPending}
            onClick={handleDelete}
          >
            {t('delete', { ns: 'common' })}
          </Button>
        }
      />

      <ChatRenameDialog
        open={renameDialog.value}
        onClose={() => renameDialog.onFalse()}
        sessionId={sessionId}
        sessionTitle={sessionTitle}
      />
    </>
  )
}
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';

import { useTranslate } from '@/locales';

import { useChat } from '@/chat/hooks/use-chat';
import { DEFAULT_TITLE } from '@/chat/context/chat-provider';

import FormProvider, { RHFTextField } from '@/components/hook-form';
import { toast } from '@/components/snackbar';

// ----------------------------------------------------------------------

type ChatRenameDialogProps = {
  open: boolean;
  onClose: () => void;
  sessionId: string;
  sessionTitle: string;
};

export function ChatRenameDialog({ open, onClose, sessionId, sessionTitle }: ChatRenameDialogProps) {
  const { t } = useTranslate();

  const { updateSessionTitle } = useChat();

  const ChatRenameSchema = Yup.object().shape({
    title: Yup.string().required(t('title.required', { ns: 'validation' }))
  });

  const defaultValues = {
    title: DEFAULT_TITLE
  };

  const currentValues = {
    title: sessionTitle
  }

  const methods = useForm({
    resolver: yupResolver(ChatRenameSchema),
    defaultValues,
    values: currentValues
  });

  const {
    handleSubmit
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const { title } = data;

    await updateSessionTitle(sessionId, title);
    toast.success(t('chat-rename-success', { ns: 'messages' }));

    onClose();
  });

  return (
    <Dialog
      open={open}
      onClose={() => onClose()}
      onClick={(e) => e.stopPropagation()}
      maxWidth='sm'
      fullWidth
    >
      <DialogTitle>{t('rename-chat', { ns: 'chat' })}</DialogTitle>

      <FormProvider methods={methods} onSubmit={onSubmit}>
        <DialogContent sx={{ pt: 1 }}>
          <RHFTextField name='title' label={t('title', { ns: 'forms' })} />
        </DialogContent>

        <DialogActions>
          <Button variant="contained" onClick={onSubmit}>
            {t('rename', { ns: 'common' })}
          </Button>

          <Button variant="outlined" color="inherit" onClick={() => onClose()}>
            {t('cancel', { ns: 'common' })}
          </Button>
        </DialogActions>
      </FormProvider>
    </Dialog>
  )
}
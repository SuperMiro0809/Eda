import * as Yup from 'yup';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { useTranslate } from '@/locales';

import { useAuth } from '@/auth/hooks/use-auth';

import { fData } from '@/utils/format-number';

import { updateProfileAction, uploadAvatarAction } from '@/actions/user';

import { toast } from '@/components/snackbar';
import FormProvider, { RHFTextField, RHFUploadAvatar } from '@/components/hook-form';

import { CONFIG } from '@/global-config';

// ----------------------------------------------------------------------

export default function ProfileGeneralTab() {
  const { user, updateUser } = useAuth();

  const { t } = useTranslate();

  const currentUser = {
    firstName: user?.first_name ?? '',
    familyName: user?.family_name ?? '',
    email: user?.email ?? '',
    avatar: user?.avatar ? `${CONFIG.assetsDir}/${user.avatar}` : null,
  };

  const defaultValues = {
    firstName: '',
    familyName: '',
    email: '',
    avatar: null as string | File | null,
  };

  const UpdateUserSchema = Yup.object().shape({
    firstName: Yup.string().required(t('first_name.required', { ns: 'validation' })),
    familyName: Yup.string().required(t('family_name.required', { ns: 'validation' })),
    email: Yup
      .string()
      .required(t('email.required', { ns: 'validation' }))
      .email(t('email.valid', { ns: 'validation' })),
  });

  const methods = useForm({
    resolver: yupResolver(UpdateUserSchema),
    defaultValues,
    values: currentUser,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleAvatarDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    const res = await uploadAvatarAction(formData);

    if (res?.error) {
      toast.error(res.error);
      return;
    }

    if (res?.data?.user) {
      updateUser(res.data.user);
      toast.success(t('update-success', { ns: 'messages' }));
    }
  }, [updateUser, t]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await updateProfileAction(data);

      if (res?.error) {
        toast.error(res.error);
        return;
      }

      if (res?.data?.user) {
        updateUser(res.data.user);
        toast.success(t('update-success', { ns: 'messages' }));
      }
    } catch (error) {
      console.error(error);
      toast.error(t('error-occurred', { ns: 'messages' }));
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              pt: 10,
              pb: 5,
              px: 3,
              textAlign: 'center',
            }}
          >
            <RHFUploadAvatar
              name="avatar"
              maxSize={3145728}
              onDrop={handleAvatarDrop}
              helperText={
                <Typography
                  variant="caption"
                  sx={{
                    mt: 3,
                    mx: 'auto',
                    display: 'block',
                    textAlign: 'center',
                    color: 'text.disabled',
                  }}
                >
                  {t('allowed_formats', { ns: 'common' })}
                  <br /> {t('max_size', { ns: 'common', size: fData(3145728) })}
                </Typography>
              }
            />

            <Button variant="soft" color="error" sx={{ mt: 3 }}>
              {t('delete_user', { ns: 'common' })}
            </Button>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                rowGap: 3,
                columnGap: 2,
                mb: 3,
                display: 'grid',
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <RHFTextField name='firstName' label={t('first_name', { ns: 'forms' })} />
              <RHFTextField name='familyName' label={t('family_name', { ns: 'forms' })} />
            </Box>

            <RHFTextField name="email" label={t('email', { ns: 'forms' })} />

            <Stack spacing={3} sx={{ mt: 3, alignItems: 'flex-end' }}>
              <Button type="submit" variant="contained" loading={isSubmitting}>
                {t('save_changes', { ns: 'common' })}
              </Button>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

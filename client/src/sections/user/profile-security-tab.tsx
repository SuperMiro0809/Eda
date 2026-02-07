import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useBoolean } from 'minimal-shared/hooks';
import { yupResolver } from '@hookform/resolvers/yup';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';

import { useTranslate } from '@/locales';

import { changePasswordAction } from '@/actions/user';

import { toast } from '@/components/snackbar';
import { Iconify } from '@/components/iconify';
import FormProvider, { RHFTextField } from '@/components/hook-form';

// ----------------------------------------------------------------------

export default function ProfileSecurityTab() {
  const { t } = useTranslate();

  const showPassword = useBoolean();

  const defaultValues = {
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  };

  const ChangePassWordSchema = Yup.object().shape({
    oldPassword: Yup.string()
      .required(t('password.required', { ns: 'validation' })),
    newPassword: Yup.string()
      .required(t('password.required', { ns: 'validation' }))
      .min(6, t('password.min', { ns: 'validation', length: 6 }))
      .matches(/[A-Z]/, t('password.capital-letter', { ns: 'validation' }))
      .matches(/\d/, t('password.digit', { ns: 'validation' })),
    confirmNewPassword: Yup.string()
      .required(t('password.required', { ns: 'validation' }))
      .oneOf([Yup.ref('newPassword')], t('password.match', { ns: 'validation' })),
  });

  const methods = useForm({
    resolver: yupResolver(ChangePassWordSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    const { oldPassword, newPassword, confirmNewPassword } = data;

    try {
      const res = await changePasswordAction({
        oldPassword,
        newPassword,
        newPassword_confirmation: confirmNewPassword,
      });

      if (res?.error) {
        toast.error(res.error);
        return;
      }

      reset();
      toast.success(t('update-success', { ns: 'messages' }));
    } catch (error) {
      console.error(error);
      toast.error(t('error-occurred', { ns: 'messages' }));
    }
  });

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Card
        sx={{
          p: 3,
          gap: 3,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <RHFTextField
          name="oldPassword"
          type={showPassword.value ? 'text' : 'password'}
          label={t('old_password', { ns: 'forms' })}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={showPassword.onToggle} edge="end">
                    <Iconify
                      icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        <RHFTextField
          name="newPassword"
          label={t('new_password', { ns: 'forms' })}
          type={showPassword.value ? 'text' : 'password'}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={showPassword.onToggle} edge="end">
                    <Iconify
                      icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
          helperText={
            <Box component="span" sx={{ gap: 0.5, display: 'flex', alignItems: 'center' }}>
              <Iconify icon="solar:info-circle-bold" width={16} /> Password must be minimum 6+
            </Box>
          }
        />

        <RHFTextField
          name="confirmNewPassword"
          type={showPassword.value ? 'text' : 'password'}
          label={t('confirm_new_password', { ns: 'forms' })}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={showPassword.onToggle} edge="end">
                    <Iconify
                      icon={showPassword.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        <Button type="submit" variant="contained" loading={isSubmitting} sx={{ ml: 'auto' }}>
          {t('save_changes', { ns: 'common' })}
        </Button>
      </Card>
    </FormProvider>
  );
}

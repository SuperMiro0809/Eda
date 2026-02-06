'use client';

import { useBoolean } from 'minimal-shared';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
// routes
import { paths } from '@/routes/paths';
import { RouterLink } from '@/routes/components';
import { useSearchParams, useRouter } from '@/routes/hooks';
// locales
import { useTranslate } from '@/locales';
// config
import { CONFIG } from '@/global-config';
// auth
import { useAuth } from '@/auth/hooks/use-auth';
// components
import { Iconify } from '@/components/iconify';
import FormProvider, { RHFTextField } from '@/components/hook-form';

// ----------------------------------------------------------------------

export default function LoginView() {
  const { t } = useTranslate();

  const { login } = useAuth();

  const router = useRouter();

  const [errorMsg, setErrorMsg] = useState('');

  const searchParams = useSearchParams();

  const returnTo = searchParams.get('returnTo');

  const password = useBoolean();

  const LoginSchema = Yup.object().shape({
    email: Yup.string().required(t('email.required', { ns: 'validation' })).email(t('email.valid', { ns: 'validation' })),
    password: Yup.string().required(t('password.required', { ns: 'validation' })),
  });

  const defaultValues = {
    email: '',
    password: '',
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await login?.(data.email, data.password);

      router.push(returnTo || CONFIG.auth.redirectPath);
    } catch (error) {
      reset();
      let message = typeof error === 'string' ? error : error.message;
      setErrorMsg(message);
    }
  });

  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5 }}>
      <Typography variant="h4">{t('login_title', { ns: 'auth' })}</Typography>
      <Stack direction="row" spacing={0.5}>
        <Typography variant="body2">{t('new_user', { ns: 'auth' })}</Typography>
        <Link component={RouterLink} href={paths.auth.register} variant="subtitle2">
          {t('create_account', { ns: 'auth' })}
        </Link>
      </Stack>
    </Stack>
  );

  const renderForm = (
    <Stack spacing={2.5}>
      {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

      {errorMsg === 'Inactive user' &&
        <Alert severity="warning">
          {t('inactive-user-message', { ns: 'messages' })}
        </Alert>
      }

      <RHFTextField name="email" label={t('email', { ns: 'forms' })} />

      <RHFTextField
        name="password"
        label={t('password', { ns: 'forms' })}
        type={password.value ? 'text' : 'password'}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={password.onToggle} edge="end">
                  <Iconify icon={password.value ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }
        }}
      />

      <Link component={RouterLink} href={paths.auth.forgotPassword} variant="body2" color="inherit" underline="always" sx={{ alignSelf: 'flex-end' }}>
        {t('forgot_password', { ns: 'auth' })}
      </Link>

      <Button
        fullWidth
        color="inherit"
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
      >
        {t('sign_in', { ns: 'auth' })}
      </Button>
    </Stack>
  );

  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      {renderHead}

      {renderForm}
    </FormProvider>
  );
}

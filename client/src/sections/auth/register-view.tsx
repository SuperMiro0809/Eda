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
// i18n
import { useTranslate } from '@/locales';
// routes
import { paths } from '@/routes/paths';
import { RouterLink } from '@/routes/components';
import { useSearchParams, useRouter } from '@/routes/hooks';
// config
import { CONFIG } from '@/global-config';
// auth
import { useAuth } from '@/auth/hooks/use-auth';
// components
import { Iconify } from '@/components/iconify';
import FormProvider, { RHFTextField } from '@/components/hook-form';

// ----------------------------------------------------------------------

export default function RegisterView() {
  const { t } = useTranslate();

  const { register } = useAuth();

  const router = useRouter();

  const [successMsg, setSuccessMsg] = useState('');

  const [errorMsg, setErrorMsg] = useState('');

  const searchParams = useSearchParams();

  const returnTo = searchParams.get('returnTo');

  const password = useBoolean();

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().required(t('first_name.required', { ns: 'validation' })),
    lastName: Yup.string().required(t('family_name.required', { ns: 'validation' })),
    email: Yup.string().required(t('email.required', { ns: 'validation' })).email(t('email.valid', { ns: 'validation' })),
    password: Yup.string().required(t('password.required', { ns: 'validation' }))
      .min(6, t('password.min', { ns: 'validation', length: 6 }))
      .matches(/[A-Z]/, t('password.capital-letter', { ns: 'validation' }))
      .matches(/\d/, t('password.digit', { ns: 'validation' })),
  });

  const defaultValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  };

  const methods = useForm({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    reset,
    handleSubmit,
    setValue,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    try {
      await register?.(data.firstName, data.lastName, data.email, data.password);

      setErrorMsg('');
      setSuccessMsg(t('register-success', { ns: 'messages' }));
    } catch (error) {
      reset();
      let message = typeof error === 'string' ? error : error.message;

      if (message === 'Account already exists') {
        message = t('account-already-exists', { ns: 'messages' });
      }

      setErrorMsg(message);
    }
  });

  const renderHead = (
    <Stack spacing={2} sx={{ mb: 5, position: 'relative' }}>
      <Typography variant="h4">{t('register_title', { ns: 'auth' })}</Typography>

      <Stack direction="row" spacing={0.5}>
        <Typography variant="body2"> {t('already_registered', { ns: 'auth' })} </Typography>

        <Link href={paths.auth.login} component={RouterLink} variant="subtitle2">
          {t('sign_in', { ns: 'auth' })}
        </Link>
      </Stack>
    </Stack>
  );

  const renderTerms = (
    <Typography
      component="div"
      sx={{
        color: 'text.secondary',
        mt: 2.5,
        typography: 'caption',
        textAlign: 'center',
      }}
    >
      {t('disclaim', { ns: 'common' })}{' '}
      <Link underline="always" color="text.primary">
        {t('terms_of_service', { ns: 'common' })}
      </Link>
      {' '}{t('and', { ns: 'common' })}{' '}
      <Link underline="always" color="text.primary">
        {t('privacy_policy', { ns: 'common' })}
      </Link>
      .
    </Typography>
  );

  const renderForm = (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Stack spacing={2.5}>
        {!!errorMsg && <Alert severity="error">{errorMsg}</Alert>}

        {!!successMsg && <Alert severity="success">{successMsg}</Alert>}

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <RHFTextField name="firstName" label={t('first_name', { ns: 'forms' })} />
          <RHFTextField name="lastName" label={t('family_name', { ns: 'forms' })} />
        </Stack>

        <RHFTextField
          name="email"
          label={t('email', { ns: 'forms' })}
          onChange={(e) => setValue('email', e.target.value.toLowerCase())}
        />

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
              )
            }
          }}
        />

        <Button
          fullWidth
          color="inherit"
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          {(t('create_account', { ns: 'auth' }))}
        </Button>
      </Stack>
    </FormProvider>
  );

  return (
    <>
      {renderHead}

      {renderForm}

      {renderTerms}
    </>
  );
}

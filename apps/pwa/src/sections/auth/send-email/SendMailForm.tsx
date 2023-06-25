import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import { Link, Stack, Typography } from '@mui/material';
import useLocales from 'hooks/useLocales';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
// redux
import { Link as RouterLink } from 'react-router-dom';
import { useDispatch } from 'redux/store';
import CountdownTimer from 'sections/auth/send-email/CountDown';

// ----------------------------------------------------------------------

type FormValuesProps = {
  email: string;
  password: string;
  remember: boolean;
  afterSubmit?: string;
};

export default function SendMailForm() {
  const { translate } = useLocales();
  const [open, setOpen] = useState(false);
  // const [timer, setTimer] = useState<number>(120);
  // redux
  const dispatch = useDispatch();

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email(translate('errors.login.email.message'))
      .required(translate('errors.login.email.required')),
  });

  const defaultValues = {
    email: '',
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  // const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
  //   if (reason === 'clickaway') {
  //     return;
  //   }
  //   setOpen(false);
  // };

  const onSubmit = async (data: FormValuesProps) => {
    // setTimer(120);
    setOpen(true);
    setTimeout(() => {
      setOpen(false);
    }, 121500);
  };

  return (
    <>
      <Stack
        data-cy="wrapper-header-back-to-login"
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ my: 3 }}
      >
        <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Cairo', fontStyle: 'Bold' }}>
          {translate('send_verify_email')}
        </Typography>
        <Link
          variant="subtitle2"
          component={RouterLink}
          to={'/auth/login'}
          sx={{ textDecorationLine: 'underline', alignSelf: 'center' }}
        >
          {translate('login')}
        </Link>
      </Stack>
      <Stack data-cy="wrapper-headline-send-mail">
        <Typography data-cy="headline-send-mail" variant="h4" gutterBottom>
          {translate('headline_verify_email')}
        </Typography>
        <Typography
          data-cy="content_verify_email"
          variant="h6"
          gutterBottom
          sx={{ fontFamily: 'Cairo', color: 'text.secondary', fontSize: '16px' }}
        >
          {translate('content_verify_email')}
        </Typography>
      </Stack>
      {/* <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3} sx={{ mt: 5 }}>
          {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

          <RHFTextField name="email" label={translate('email_label')} />
        </Stack>

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
          sx={{ my: 2 }}
          disabled={open}
        >
          {!open ? translate('send_email') : <CountdownTimer time={120} />}
        </LoadingButton>
      </FormProvider> */}
      <LoadingButton
        data-cy="button-send-mail"
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isSubmitting}
        sx={{ my: 2 }}
        disabled={open}
        onClick={() => {
          setOpen(true);
          setTimeout(() => {
            setOpen(false);
          }, 121500);
        }}
      >
        {!open ? translate('send_email') : <CountdownTimer time={120} />}
      </LoadingButton>
    </>
  );
}

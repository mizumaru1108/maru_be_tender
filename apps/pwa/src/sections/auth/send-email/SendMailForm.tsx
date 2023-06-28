import { LoadingButton } from '@mui/lab';
import { Alert, Link, Stack, Typography } from '@mui/material';
import useLocales from 'hooks/useLocales';
import { useEffect, useState } from 'react';
// redux
import axios from 'axios';
import { FEATURE_VERIFICATION_SIGN_UP, TMRA_RAISE_URL } from 'config';
import { useSnackbar } from 'notistack';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import CountdownTimer from 'sections/auth/send-email/CountDown';
import { FormProvider, RHFTextField } from 'components/hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useForm } from 'react-hook-form';

// ----------------------------------------------------------------------

type FormValuesProps = {
  email: string;
};

interface Props {
  // email?: string;
  isResend?: boolean;
}

export default function SendMailForm({ isResend = false }: Props) {
  const { translate } = useLocales();
  const [open, setOpen] = useState(false);
  const params = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const SendCodeVerify = Yup.object().shape({
    email: Yup.string()
      .email(translate('errors.login.email.message'))
      .required(translate('errors.login.email.required')),
  });

  const defaultValues = {
    email: '',
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(SendCodeVerify),
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const sendVerifyEmail = async (emailVerify: string) => {
    setIsLoading(true);
    try {
      const { status } = await axios.post(`${TMRA_RAISE_URL}/tender-auth/send-email-verif`, {
        email: emailVerify,
      });

      if (status) {
        if (params.email || isResend) {
          navigate(`/auth/login`);
        }
        // if (email) {
        //   setOpen(true);
        //   setTimeout(() => {
        //     setOpen(false);
        //   }, 121500);
        // }
        enqueueSnackbar(translate('snackbar.auth.register.send_verify_email.success'), {
          variant: 'success',
          preventDuplicate: true,
          autoHideDuration: 3000,
        });
      }
    } catch (err) {
      const statusCode = (err && err.statusCode) || 0;
      const message = (err && err.message) || null;
      enqueueSnackbar(
        `${
          statusCode < 500 && message ? message : translate('pages.common.internal_server_error')
        }`,
        {
          variant: 'error',
          preventDuplicate: true,
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
        }
      );
    } finally {
      setIsLoading(false);
    }
  };
  const onSubmit = async (data: FormValuesProps) => {
    sendVerifyEmail(data.email);
  };

  const hanldeSubmit = async () => {
    // if (email) {
    //   sendVerifyEmail(email);
    // }
    if (params.email) {
      sendVerifyEmail(params.email);
    }
  };

  // useEffect(() => {
  //   if (FEATURE_VERIFICATION_SIGN_UP && email) {
  //     setOpen(true);
  //     setTimeout(() => {
  //       setOpen(false);
  //     }, 121500);
  //   }
  // }, [email]);

  useEffect(() => {
    const handleBeforeUnload = (event: any) => {
      if (open) {
        event.preventDefault();
        event.returnValue = ''; // Untuk mendukung beberapa browser lama
        const message = 'Are you sure you want to leave?';
        return message;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <>
      {FEATURE_VERIFICATION_SIGN_UP ? (
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
          {!isResend ? null : (
            <FormProvider
              data-cy="form-send-mail"
              methods={methods}
              onSubmit={handleSubmit(onSubmit)}
            >
              <Stack spacing={3} sx={{ mt: 5 }}>
                <RHFTextField data-cy="email_label" name="email" label={translate('email_label')} />
              </Stack>

              <LoadingButton
                data-cy="button-send-mail"
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                loading={isSubmitting || isLoading}
                sx={{ my: 2 }}
                disabled={open}
              >
                {translate('send_email')}
              </LoadingButton>
            </FormProvider>
          )}
          {!isResend ? (
            <LoadingButton
              data-cy="button-send-mail"
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              loading={isLoading}
              sx={{ my: 2 }}
              disabled={open}
              onClick={hanldeSubmit}
            >
              {!open ? translate('send_email') : <CountdownTimer time={120} />}
            </LoadingButton>
          ) : null}
        </>
      ) : (
        <>Under Construction</>
      )}
    </>
  );
}

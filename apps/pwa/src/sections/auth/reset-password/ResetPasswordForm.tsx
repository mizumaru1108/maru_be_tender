import * as Yup from 'yup';
import { useNavigate, useLocation } from 'react-router-dom';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import useLocales from 'hooks/useLocales';
import useAuth from 'hooks/useAuth';
//
import axios from 'axios';
import { TMRA_RAISE_URL } from 'config';
import { useSnackbar } from 'notistack';

// ----------------------------------------------------------------------

type FormValuesProps = {
  email: string;
};

export default function ResetPasswordForm() {
  const navigate = useNavigate();
  const location = useLocation();

  const { translate, currentLang } = useLocales();
  const { enqueueSnackbar } = useSnackbar();
  const { activeRole } = useAuth();

  const ResetPasswordSchema = Yup.object().shape({
    email: Yup.string()
      .email(translate('errors.login.email.message'))
      .required(translate('errors.login.email.required')),
  });

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(ResetPasswordSchema),
    defaultValues: { email: '' },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = methods;

  const onSubmit = async (formValues: FormValuesProps) => {
    // const x = location.pathname.split('/');

    try {
      const { status, data } = await axios.post(
        `${TMRA_RAISE_URL}/tender-auth/forgot-password-request`,
        {
          email: formValues.email,
          selectLang: currentLang.value,
        }
      );
      if (status === 201) {
        enqueueSnackbar(
          `${translate('account_manager.partner_details.notification.reset_password')}`,
          {
            variant: 'success',
            autoHideDuration: 3000,
          }
        );
        reset({ email: '' });
        // navigate(`/auth/${x[2]}/${data.data}`);
      }
    } catch (err) {
      if (typeof err.message === 'object') {
        err.message.forEach((el: any) => {
          enqueueSnackbar(el, {
            variant: 'error',
            preventDuplicate: true,
            autoHideDuration: 3000,
          });
        });
      } else {
        // enqueueSnackbar(translate('errors.reset_password.something_wrong'), {
        //   variant: 'error',
        //   preventDuplicate: true,
        //   autoHideDuration: 3000,
        // });
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
      }

      reset({ email: '' });
      console.error(err);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <RHFTextField name="email" label={translate('email')} size="small" />

        <LoadingButton
          fullWidth
          size="medium"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          {translate('account_manager.partner_details.btn_amndreq_send_request')}
        </LoadingButton>
      </Stack>
    </FormProvider>
  );
}

import * as Yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import useLocales from 'hooks/useLocales';
//
import axios from 'axios';
import { TMRA_RAISE_URL } from 'config';
import { useSnackbar } from 'notistack';

// ----------------------------------------------------------------------

type FormValuesProps = {
  new_password: string;
};

export default function ForgotPasswordForm() {
  const navigate = useNavigate();
  const params = useParams();

  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();

  const ResetPasswordSchema = Yup.object().shape({
    new_password: Yup.string().required(translate('errors.reset_password.password.new_required')),
  });

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(ResetPasswordSchema),
    defaultValues: { new_password: '' },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
    setError,
  } = methods;

  const handleOnSubmit = async (formData: FormValuesProps) => {
    const payload = {
      changePasswordId: params.id,
      newPassword: formData.new_password,
    };

    try {
      const { status } = await axios.post(
        `${TMRA_RAISE_URL}/tender-auth/submit-change-password`,
        payload
      );

      if (status === 201) {
        enqueueSnackbar(translate('errors.reset_password.success_reset_password'), {
          variant: 'success',
          autoHideDuration: 3000,
        });

        navigate('/auth/login');
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
        const statusCode =
          (err && err?.response?.data?.status) ||
          (err && err?.response?.data?.response?.statusCode) ||
          (err && err.statusCode) ||
          0;
        const message =
          (err && err?.response?.data?.message) ||
          (err && err?.response?.data?.response?.message) ||
          (err && err.message) ||
          null;
        // console.log({ err, message });
        const showMessage =
          statusCode === 400
            ? // ? translate('snackbar.auth.reset_password.wrong_old_password')
              'يرجى التأكيد مع مدير الحساب لأنه لا يمكنك تغيير كلمة المرور الخاصة بك مؤقتًا'
            : statusCode !== 0
            ? message
            : translate('pages.common.internal_server_error');
        enqueueSnackbar(showMessage, {
          variant: 'error',
          preventDuplicate: true,
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
        });
      }

      // setError('new_password', { type: 'focus' }, { shouldFocus: true });

      reset({ new_password: '' });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(handleOnSubmit)}>
      <Stack spacing={3} sx={{ mb: 1 }}>
        <RHFTextField
          name="new_password"
          label={translate('new_password_label')}
          placeholder={translate('placeholder_reset_password')}
          size="small"
        />

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

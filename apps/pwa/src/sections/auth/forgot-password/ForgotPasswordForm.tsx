import { useNavigate, useParams } from 'react-router-dom';
import * as Yup from 'yup';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import { Alert, Stack } from '@mui/material';
// components
import useLocales from 'hooks/useLocales';
import { FormProvider, RHFTextField } from '../../../components/hook-form';
//
import axios from 'axios';
import { FEATURE_NEW_PASSWORD_VALIDATION, TMRA_RAISE_URL } from 'config';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import PasswordValidation, {
  ValidationType,
} from '../../../components/password-validation/password-validation';

// ----------------------------------------------------------------------

type FormValuesProps = {
  new_password: string;
};

export default function ForgotPasswordForm() {
  const navigate = useNavigate();
  const params = useParams();

  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();

  const [validation, setValidation] = useState<ValidationType>({
    uppper_case: false,
    special_char: false,
    number: false,
  });
  const [error, setError] = useState({
    open: false,
    message: '',
  });

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
    watch,
  } = methods;

  const newPassword = watch('new_password');

  const handleOnSubmit = async (formData: FormValuesProps) => {
    const check = Object.values(validation).every((val) => val);
    const payload = {
      changePasswordId: params.id,
      newPassword: formData.new_password,
    };

    if (!check && FEATURE_NEW_PASSWORD_VALIDATION) {
      setError({
        open: true,
        message: translate('notification.error.password.validation.failed'),
      });
      return null;
    }

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
    } finally {
      reset({ new_password: '' });
    }
  };

  const handlePasswordValidation = (value: ValidationType) => {
    setValidation({
      uppper_case: value.uppper_case,
      special_char: value.special_char,
      number: value.number,
    });
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
        {FEATURE_NEW_PASSWORD_VALIDATION && (
          <Stack sx={{ mt: 2 }}>
            <PasswordValidation
              password={newPassword || ''}
              type={['uppper_case', 'special_char', 'number']}
              onReturn={handlePasswordValidation}
            />
          </Stack>
        )}

        {error.open && (
          <Stack sx={{ my: 2 }}>
            <Alert severity="error">{error.message}</Alert>
          </Stack>
        )}

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

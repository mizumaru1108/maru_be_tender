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
import { FEATURE_NEW_PASSWORD_VALIDATION, TMRA_RAISE_URL } from 'config';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import PasswordValidation, {
  ValidationType,
} from '../../../components/password-validation/password-validation';
import RHFPassword from '../../../components/hook-form/RHFPassword';

// ----------------------------------------------------------------------

type FormValuesProps = {
  old_password: string;
  new_password: string;
};

export default function ResetPasswordForm() {
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
    old_password: Yup.string().required(translate('errors.reset_password.password.old_required')),
    new_password: Yup.string().required(translate('errors.reset_password.password.new_required')),
  });

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(ResetPasswordSchema),
    defaultValues: { old_password: '', new_password: '' },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
    watch,
  } = methods;
  const newPassword = watch('new_password');

  const handleOnSubmit = async (formData: FormValuesProps) => {
    const payload = {
      changePasswordId: params.id,
      oldPassword: formData.old_password,
      newPassword: formData.new_password,
    };

    const check = Object.values(validation).every((val) => val);
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
      reset({
        new_password: '',
        old_password: '',
      });
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
        <RHFPassword
          name="old_password"
          label={translate('old_password_label')}
          placeholder={translate('placeholder_reset_password')}
        />
        <RHFPassword
          name="new_password"
          label={translate('new_password_label')}
          placeholder={translate('placeholder_reset_password')}
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

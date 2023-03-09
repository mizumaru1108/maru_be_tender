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
  old_password: string;
  new_password: string;
};

export default function ResetPasswordForm() {
  const navigate = useNavigate();
  const params = useParams();

  const { translate } = useLocales();
  const { enqueueSnackbar } = useSnackbar();

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
  } = methods;

  const handleOnSubmit = async (formData: FormValuesProps) => {
    const payload = {
      changePasswordId: params.id,
      oldPassword: formData.old_password,
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
        enqueueSnackbar(translate('errors.reset_password.something_wrong'), {
          variant: 'error',
          preventDuplicate: true,
          autoHideDuration: 3000,
        });
      }

      reset({
        new_password: '',
        old_password: '',
      });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(handleOnSubmit)}>
      <Stack spacing={3} sx={{ mb: 1 }}>
        <RHFTextField
          name="old_password"
          label={translate('old_password_label')}
          placeholder={translate('placeholder_reset_password')}
          size="small"
        />
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

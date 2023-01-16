import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
// @mui
import { Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
// components
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import useLocales from 'hooks/useLocales';
import { fusionAuthClient } from 'utils/fusionAuth';
import { FUSIONAUTH_API } from 'config';
import axios from 'axios';

// ----------------------------------------------------------------------

type FormValuesProps = {
  email: string;
};

export default function ResetPasswordForm() {
  const navigate = useNavigate();

  const { translate } = useLocales();

  const ResetPasswordSchema = Yup.object().shape({
    email: Yup.string()
      .email(translate("email.error 'Email must be a valid email address'"))
      .required(translate('email.required Email is required')),
  });

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(ResetPasswordSchema),
    defaultValues: { email: '' },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    try {
      const response = await axios.post(
        `${FUSIONAUTH_API.apiUrl}/api/user/forgot-password`,
        {
          loginId: data.email,
        },
        { headers: { 'x-fusionauth-tenantid': FUSIONAUTH_API.tenantId! } }
      );
      console.log(response);
    } catch (error) {
      console.log('asdlknasdklnaskdlnaskldnaklsdnkalsd');
      console.error(error);
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        <RHFTextField name="email" label="Email address" />

        <LoadingButton
          fullWidth
          size="large"
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

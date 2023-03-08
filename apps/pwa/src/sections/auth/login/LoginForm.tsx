import * as Yup from 'yup';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link, Stack, Alert, IconButton, InputAdornment, Snackbar } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { PATH_AUTH } from '../../../routes/paths';
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField, RHFCheckbox } from '../../../components/hook-form';
import useLocales from 'hooks/useLocales';
import useAuth from 'hooks/useAuth';
// redux
import { useDispatch } from 'redux/store';
import { setConversation, setMessageGrouped, setActiveConversationId } from 'redux/slices/wschat';

// ----------------------------------------------------------------------

type FormValuesProps = {
  email: string;
  password: string;
  remember: boolean;
  afterSubmit?: string;
};

export default function LoginForm() {
  const { login } = useAuth();
  const { translate } = useLocales();
  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = useState(false);

  // redux
  const dispatch = useDispatch();

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email(translate('errors.login.email.message'))
      .required(translate('errors.login.email.required')),
    password: Yup.string().required(translate('errors.login.password.required')),
  });

  const defaultValues = {
    email: '',
    password: '',
    remember: false,
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

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const onSubmit = async (data: FormValuesProps) => {
    try {
      await login(data.email, data.password);
      dispatch(setActiveConversationId(null));
      dispatch(setConversation([]));
      dispatch(setMessageGrouped([]));
    } catch (error) {
      reset();
      setError('afterSubmit', { ...error, message: translate('login_message_error') });
    }
  };

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3} sx={{ mt: 5 }}>
          {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

          <RHFTextField name="email" label={translate('email_label')} />

          <RHFTextField
            name="password"
            label={translate('password_label')}
            type={showPassword ? 'text' : 'password'}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                    <Iconify
                      icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'}
                      sx={{ color: 'text.primary' }}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
          <RHFCheckbox name="remember" label={translate('remember_me')} />
          <Link
            component={RouterLink}
            variant="subtitle2"
            to={PATH_AUTH.forgotPassword}
            sx={{ textDecorationLine: 'underline' }}
          >
            {translate('forget_the_password')}
          </Link>
        </Stack>

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          {translate('login')}
        </LoadingButton>
      </FormProvider>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert severity="error" onClose={handleClose} sx={{ width: '100%' }}>
          This is a success message!
        </Alert>
      </Snackbar>
    </>
  );
}

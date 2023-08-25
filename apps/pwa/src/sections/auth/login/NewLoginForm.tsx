import * as Yup from 'yup';
import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Link,
  Stack,
  Alert,
  IconButton,
  InputAdornment,
  Snackbar,
  MenuItem,
  useTheme,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { PATH_AUTH } from '../../../routes/paths';
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField, RHFCheckbox, RHFSelect } from '../../../components/hook-form';
import useLocales from 'hooks/useLocales';
import useAuth from 'hooks/useAuth';
// redux
import { useDispatch } from 'redux/store';
import { setConversation, setMessageGrouped, setActiveConversationId } from 'redux/slices/wschat';
import { SxProps, Theme } from '@mui/material/styles';

// ----------------------------------------------------------------------

const OptionLoginId = [
  {
    value: 'email',
    label: 'select_loginId.email',
  },
  {
    value: 'phone',
    label: 'select_loginId.phone',
  },
];

type FormValuesProps = {
  select_loginId: string;
  mobile_number: string;
  email: string;
  password: string;
  remember: boolean;
  afterSubmit?: string;
};

export default function NewLoginForm() {
  const theme = useTheme();
  const { login } = useAuth();
  const { translate, currentLang } = useLocales();
  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = useState(false);
  const [loginTypeId, setLoginTypeId] = useState('email');

  // styling
  const sxStyling: SxProps<Theme> | undefined = {
    mr: `${currentLang.value}` === 'ar' ? 1 : 1.5,
    ml: `${currentLang.value}` === 'ar' ? 0 : 0,
    px: 1.5,
    height: 'auto',
    // borderRight: `1px solid ${theme.palette.text.disabled}`,
    borderRight:
      `${currentLang.value}` === 'ar' ? 'none' : `1px solid ${theme.palette.text.disabled}`,
    borderLeft:
      `${currentLang.value}` === 'ar' ? `1px solid ${theme.palette.text.disabled}` : 'none',
    color: theme.palette.text.disabled,
    '& > .MuiTypography-root': {
      color: theme.palette.text.disabled,
    },
  };

  // redux
  const dispatch = useDispatch();

  const LoginSchema = React.useMemo(() => {
    const tmpType = loginTypeId;
    return Yup.object().shape({
      ...(tmpType === 'email' && {
        email: Yup.string()
          .email(translate('errors.login.email.message'))
          .required(translate('errors.login.email.required')),
      }),
      ...(tmpType === 'phone' && {
        mobile_number: Yup.string()
          .required(translate('errors.register.entity_mobile.required'))
          .test('len', translate('errors.register.entity_mobile.length'), (val) => {
            if (val === undefined || val?.length === 0) {
              return false;
            }

            return val!.length === 9;
          }),
      }),
      password: Yup.string().required(translate('errors.login.password.required')),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loginTypeId]);
  // console.log({ LoginSchema });

  const defaultValues = {
    select_loginId: 'email',
    mobile_number: '',
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
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = methods;
  // console.log({ errors });
  const loginIdType = watch('select_loginId');

  React.useEffect(() => {
    if (loginIdType) {
      setLoginTypeId(loginIdType);
      setValue('email', '');
      setValue('mobile_number', '');
    }
  }, [loginIdType, setValue]);
  // console.log({ loginIdType });

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const onSubmit = async (data: FormValuesProps) => {
    let tmpLoginId = undefined;
    if (data.email && loginTypeId === 'email') {
      tmpLoginId = data.email;
    } else {
      const tmpPhone = `966${data.mobile_number}`;
      tmpLoginId = tmpPhone;
    }
    // console.log('tmpLoginId', tmpLoginId);
    try {
      await login(tmpLoginId, data.password);
      dispatch(setActiveConversationId(null));
      dispatch(setConversation([]));
      dispatch(setMessageGrouped([]));
    } catch (error) {
      // console.log('cek error: ', { message: error.message });
      reset();
      setError('afterSubmit', { message: error.message || translate('login_message_error') });
      // setError('afterSubmit', { ...error, message: translate('login_message_error') });
    }
  };

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3} sx={{ mt: 5 }}>
          {!!errors.afterSubmit && <Alert severity="error">{errors.afterSubmit.message}</Alert>}

          <RHFSelect
            type="select"
            name="select_loginId"
            data-cy="select-loginId"
            label={translate('select_loginId.label')}
            placeholder={translate('select_loginId.placeholder')}
            size="medium"
          >
            {/* <MenuItem data-cy={`select-option.select_loginId-`} value={'1'}>
              {'test'}
            </MenuItem>
            <MenuItem data-cy={`select-option.select_loginId-`} value={'2'}>
              {'test'}
            </MenuItem> */}
            {OptionLoginId.map((option, index) => (
              <MenuItem
                data-cy={`select-option.select_loginId-${index}`}
                key={option.value}
                value={option.value}
              >
                {translate(option.label)}
              </MenuItem>
            ))}
          </RHFSelect>

          {loginIdType === 'email' ? (
            <RHFTextField name="email" label={translate('email_label')} sx={{ direction: 'rtl' }} />
          ) : (
            <RHFTextField name="mobile_number" label={translate('mobile_number')} />
          )}
          {/* <RHFTextField
            type={'number'}
            name="loginId"
            label={translate('email_label')}
            onChange={(e) => {
              const newNumber = e.target.value.match(/\+?\d+/g)?.[0].slice(0, 9) ?? '';
              setValue('loginId', newNumber);
            }}
            InputProps={{
              endAdornment: (
                <InputAdornment
                  position="start"
                  sx={{
                    ...sxStyling,
                  }}
                >
                  +966
                </InputAdornment>
              ),
            }}
          /> */}

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

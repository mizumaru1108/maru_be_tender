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
  Typography,
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
import { FEATURE_LOGIN_BY_LICENSE, FEATURE_LOGIN_BY_PHONE } from 'config';
import formatPhone from 'utils/formatPhone';

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
  {
    value: 'license',
    label: 'select_loginId.license',
  },
];

type FormValuesProps = {
  select_loginId: string;
  mobile_number: string;
  mobile_number_login: string;
  email: string;
  license_number: string;
  password: string;
  remember: boolean;
  afterSubmit?: string;
};

export default function NewLoginForm() {
  const theme = useTheme();
  const { login } = useAuth();
  const { translate, currentLang } = useLocales();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [open, setOpen] = useState(false);
  const [loginTypeId, setLoginTypeId] = useState('email');
  const [loginId, setLoginId] = useState<string | null>(null);

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
      ...(tmpType === 'license' && {
        license_number: Yup.string().required(translate('errors.register.license_number.required')),
      }),
      ...(tmpType === 'phone' && {
        mobile_number_login: Yup.string()
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
    mobile_number_login: '',
    email: '',
    license_number: '',
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
      setValue('mobile_number_login', '');
      setValue('license_number', '');
    }
  }, [loginIdType, setValue]);
  // console.log({ loginIdType });

  const handleRedirect = () => {
    if (loginId && loginIdType === 'email') {
      navigate(`/auth/send-email/${loginId}`);
    } else {
      navigate('/auth/send-email');
    }
  };

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
      setLoginId(data.email);
    } else if (data.mobile_number_login && loginTypeId === 'phone') {
      // const tmpPhone = `+966${data.mobile_number_login}`;
      const tmpPhone = formatPhone({ phone: data.mobile_number_login, prefix: '+966' });
      tmpLoginId = tmpPhone;
    } else {
      tmpLoginId = data.license_number;
    }
    // console.log('tmpLoginId', tmpLoginId);
    try {
      await login(tmpLoginId, data.password);
      dispatch(setActiveConversationId(null));
      dispatch(setConversation([]));
      dispatch(setMessageGrouped([]));
      setLoginId(null);
    } catch (err) {
      // console.log({ err });
      // const { error, message } =
      //   FEATURE_LOGIN_BY_PHONE || FEATURE_LOGIN_BY_LICENSE ? err : err.response.data;
      const statusCode =
        err?.response?.data?.statusCode ||
        err?.response?.data?.status ||
        err?.response?.statusCode ||
        err?.status ||
        undefined;
      const tmpMessage =
        err?.response?.data?.message || err?.response?.message || err?.message || undefined;
      // console.log('cek err: ', { err: err?.response?.data });
      // console.log('test statusCode', { statusCode });
      reset();
      if (statusCode === 401 && statusCode !== undefined) {
        setError('afterSubmit', { message: translate('pages.auth.error.wrong_credential') });
      } else {
        setError('afterSubmit', { message: tmpMessage || translate('login_message_error') });
      }
      // setError('afterSubmit', { ...error, message: translate('login_message_error') });
    }
  };

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3} sx={{ mt: 5 }}>
          {!!errors.afterSubmit && (
            <>
              {errors.afterSubmit.message !== 'un_verified' ? (
                <Alert severity="error">{errors.afterSubmit.message}</Alert>
              ) : (
                <Alert severity="error">
                  <Typography>
                    {/* {translate('pages.admin.settings.label.form.authorities.confirmation.delete')}{' '}
                  <span style={{ fontWeight: 700 }}>{`${formatCapitalizeText(watch('name'))}`}</span>? */}
                    {/* test1 */}
                    البريد الالكتروني لم يتم تفعيله بعد
                    <span style={{ cursor: 'pointer' }} onClick={handleRedirect}>
                      <b>
                        <u>.يرجى الضغط هنا لإعادة إرسال بريد التفعيل</u>
                      </b>
                    </span>
                  </Typography>
                </Alert>
              )}
            </>
          )}

          <RHFSelect
            type="select"
            name="select_loginId"
            data-cy="select-loginId"
            label={translate('select_loginId.label')}
            placeholder={translate('select_loginId.placeholder')}
            size="medium"
          >
            {OptionLoginId.map((option, index) => {
              const { value, label } = option;
              if (value === 'phone' && !FEATURE_LOGIN_BY_PHONE) {
                return null;
              }
              if (value === 'license' && !FEATURE_LOGIN_BY_LICENSE) {
                return null;
              }
              return (
                <MenuItem
                  data-cy={`select-option.select_loginId-${index}`}
                  key={value}
                  value={value}
                >
                  {translate(label)}
                </MenuItem>
              );
            })}
          </RHFSelect>

          {loginIdType === 'email' ? (
            <RHFTextField name="email" label={translate('email_label')} sx={{ direction: 'rtl' }} />
          ) : null}
          {loginIdType === 'phone' ? (
            <RHFTextField name="mobile_number_login" label={translate('mobile_number')} />
          ) : null}
          {loginIdType === 'license' ? (
            <RHFTextField
              name="license_number"
              label={translate('account_manager.partner_details.license_number')}
              sx={{ direction: 'rtl' }}
            />
          ) : null}
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

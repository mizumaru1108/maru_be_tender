import { yupResolver } from '@hookform/resolvers/yup';
import { Alert, Button, Grid, Stack } from '@mui/material';
import { FormProvider, RHFTextField } from 'components/hook-form';
import useLocales from 'hooks/useLocales';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { UserInfoFormProps } from '../../../../@types/register';
import RHFPassword from '../../../../components/hook-form/RHFPassword';
import PasswordValidation, {
  ValidationType,
} from '../../../../components/password-validation/password-validation';
import { FEATURE_NEW_PASSWORD_VALIDATION } from '../../../../config';
import useAuth from '../../../../hooks/useAuth';

type FormProps = {
  children?: React.ReactNode;
  onSubmit: (data: any) => void;
  defaultValues: UserInfoFormProps;
};

const UserInfoForm = ({ children, onSubmit, defaultValues }: FormProps) => {
  const [changePassword, setChangePassword] = useState(false);
  const { translate } = useLocales();
  const { activeRole } = useAuth();
  const [validation, setValidation] = useState<ValidationType>({
    uppper_case: false,
    special_char: false,
    number: false,
    match: false,
  });
  const [error, setError] = useState({
    open: false,
    message: '',
  });

  const ClientInformationChangeSchema = Yup.object().shape({
    email: Yup.string()
      .required(translate('errors.register.email.required'))
      .email(translate('errors.register.email.email')),
    current_password: Yup.string()
      .required(translate('errors.register.password.required'))
      .test('len', translate('errors.register.password.min'), (val) => {
        if (val === undefined) {
          return true;
        } else {
          return val!.length === 0 || val!.length > 7;
        }
      }),
  });

  const EmployeeInformationChangeSchema = Yup.object().shape({
    email: Yup.string()
      .required(translate('errors.register.email.required'))
      .email(translate('errors.register.email.email')),
    employee_name: Yup.string().required(translate('errors.register.employee_name.required')),

    mobile_number: Yup.string()
      .required(translate('errors.register.entity_mobile.required'))
      .test('len', translate('errors.register.entity_mobile.length'), (val) => {
        if (val === undefined) {
          return true;
        }

        return val.length === 0 || val!.length === 9;
      }),
    current_password: Yup.string()
      .required(translate('errors.register.password.required'))
      .test('len', translate('errors.register.password.min'), (val) => {
        if (val === undefined) {
          return true;
        } else {
          return val!.length === 0 || val!.length > 7;
        }
      }),
  });
  const ClientPasswordChangeSchema = Yup.object().shape({
    email: Yup.string()
      .required(translate('errors.register.email.required'))
      .email(translate('errors.register.email.email')),
    current_password: Yup.string()
      .required(translate('errors.register.password.required'))
      .test('len', translate('errors.register.password.min'), (val) => {
        if (val === undefined) {
          return true;
        } else {
          return val!.length === 0 || val!.length > 7;
        }
      }),
    new_password: Yup.string()
      .required(translate('errors.register.password.new_password'))
      .test('len', translate('errors.register.password.min'), (val) => {
        if (val === undefined) {
          return true;
        } else {
          return val!.length === 0 || val!.length > 7;
        }
      }),
    confirm_password: Yup.string().oneOf(
      [Yup.ref('new_password'), null],
      translate('errors.register.password.confirm_password')
    ),
  });
  const EmployeePasswordChangeSchema = Yup.object().shape({
    email: Yup.string()
      .required(translate('errors.register.email.required'))
      .email(translate('errors.register.email.email')),
    mobile_number: Yup.string()
      .required(translate('errors.register.entity_mobile.required'))
      .test('len', translate('errors.register.entity_mobile.length'), (val) => {
        if (val === undefined) {
          return true;
        }

        return val.length === 0 || val!.length === 9;
      }),
    employee_name: Yup.string()
      .required(translate('errors.register.employee_name.required'))
      .test('len', translate('errors.register.password.min'), (val) => {
        if (val === undefined) {
          return true;
        } else {
          return val!.length === 0 || val!.length > 7;
        }
      }),
    current_password: Yup.string()
      .required(translate('errors.register.password.required'))
      .test('len', translate('errors.register.password.min'), (val) => {
        if (val === undefined) {
          return true;
        } else {
          return val!.length === 0 || val!.length > 7;
        }
      }),
    new_password: Yup.string()
      .required(translate('errors.register.password.new_password'))
      .test('len', translate('errors.register.password.min'), (val) => {
        if (val === undefined) {
          return true;
        } else {
          return val!.length === 0 || val!.length > 7;
        }
      }),
    confirm_password: Yup.string().oneOf(
      [Yup.ref('new_password'), null],
      translate('errors.register.password.confirm_password')
    ),
  });

  const methods = useForm<UserInfoFormProps>({
    resolver: yupResolver(
      // changePassword ? ClientPasswordChangeSchema : ClientInformationChangeSchema
      changePassword && activeRole !== 'tender_client'
        ? EmployeePasswordChangeSchema
        : changePassword && activeRole === 'tender_client'
        ? ClientPasswordChangeSchema
        : !changePassword && activeRole !== 'tender_client'
        ? EmployeeInformationChangeSchema
        : ClientInformationChangeSchema
    ),
    defaultValues: useMemo(() => defaultValues, [defaultValues]),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
    watch,
  } = methods;

  const newPassword = watch('new_password');
  const confirmPassword = watch('confirm_password');

  const onSubmitForm = async (data: UserInfoFormProps) => {
    let newPayload = { ...data };

    const filteredObj = Object.fromEntries(
      Object.entries(newPayload).filter(([key, value]) => value)
    );
    delete filteredObj.confirm_password;

    // check password validationResult
    const check = Object.values(validation).every((val) => val);

    if (changePassword) {
      if (FEATURE_NEW_PASSWORD_VALIDATION) {
        if (check) {
          setError({
            open: false,
            message: '',
          });
          onSubmit(filteredObj);
        } else {
          setError({
            open: true,
            message: translate('notification.error.password.validation.failed'),
          });
        }
      } else {
        onSubmit(filteredObj);
      }
    } else {
      setError({
        open: false,
        message: '',
      });
      onSubmit(filteredObj);
    }
  };

  const handlePasswordValidation = (value: ValidationType) => {
    setValidation(value);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (activeRole !== 'tender_client') {
      let newValues = { ...defaultValues };
      const newEntityPhone = defaultValues.mobile_number?.replace('+966', '');
      newValues = { ...newValues, mobile_number: newEntityPhone };
      reset(newValues);
    } else {
      reset(defaultValues);
    }
  }, [defaultValues, reset, activeRole]);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitForm)}>
      <Grid container rowSpacing={4} columnSpacing={7}>
        <Grid item xs={12}>
          <RHFTextField
            name="email"
            label={translate('register_form2.email.label')}
            placeholder={translate('register_form2.email.placeholder')}
          />
        </Grid>

        {activeRole !== 'tender_client' && (
          <>
            <Grid item xs={12} md={6}>
              <RHFTextField
                name="employee_name"
                label={translate('register_form2.employee_name.label')}
                placeholder={translate('register_form2.employee_name.placeholder')}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <RHFTextField
                name="mobile_number"
                label={translate('register_form2.mobile_number.label')}
                placeholder="xxx xxx xxx"
              />
            </Grid>
          </>
        )}
        <Grid item xs={12} md={12}>
          <RHFPassword
            name="current_password"
            label={translate('register_form2.password.label')}
            placeholder={translate('register_form2.password.placeholder')}
          />
        </Grid>

        {changePassword && (
          <>
            <Grid item md={6} xs={12}>
              <RHFPassword
                name="new_password"
                label={translate('register_form2.new_password.title')}
                placeholder={translate('register_form2.new_password.placeholder')}
              />
              {FEATURE_NEW_PASSWORD_VALIDATION && (
                <Stack sx={{ mt: 2 }}>
                  <PasswordValidation
                    password={newPassword || ''}
                    confirmPassword={confirmPassword || ''}
                    type={['uppper_case', 'special_char', 'number', 'match']}
                    onReturn={handlePasswordValidation}
                  />
                </Stack>
              )}
            </Grid>
            <Grid item md={6} xs={12}>
              <RHFPassword
                name="confirm_password"
                label={translate('register_form2.confirm_password.title')}
                placeholder={translate('register_form2.confirm_password.placeholder')}
              />
            </Grid>
          </>
        )}

        {error.open && (
          <Grid item md={12} sx={{ my: 2 }}>
            <Alert severity="error">{error.message}</Alert>
          </Grid>
        )}

        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={6} md={3}>
              <Button
                size="large"
                onClick={() => setChangePassword(!changePassword)}
                variant={changePassword ? 'outlined' : 'contained'}
                sx={{
                  backgroundColor: changePassword ? '#fff' : 'background.paper',
                  color: changePassword ? 'background.paper' : '#fff',
                  width: { xs: '100%', sm: '200px' },
                  height: { xs: '100%', sm: '50px' },
                }}
              >
                {changePassword ? 'عدم تغيير كلمة المرور' : 'غير كلمة السر'}
              </Button>
            </Grid>
            <Grid item xs={6} md={3}>
              {children}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </FormProvider>
  );
};

export default UserInfoForm;

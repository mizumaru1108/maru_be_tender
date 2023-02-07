import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Grid } from '@mui/material';
import { FormProvider, RHFTextField } from 'components/hook-form';
import useLocales from 'hooks/useLocales';
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { UserInfoFormProps } from '../../../../@types/register';
import RHFPassword from '../../../../components/hook-form/RHFPassword';

type FormProps = {
  children?: React.ReactNode;
  onSubmit: (data: any) => void;
  defaultValues: UserInfoFormProps;
};

const UserInfoForm = ({ children, onSubmit, defaultValues }: FormProps) => {
  const [changePassword, setChangePassword] = useState(false);
  const { translate } = useLocales();
  const RegisterSchema = Yup.object().shape({
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
    current_password: Yup.string().required(translate('errors.register.password.required')),
  });
  const PasswordChangeSchema = Yup.object().shape({
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
    employee_name: Yup.string().required(translate('errors.register.employee_name.required')),
    current_password: Yup.string().required(translate('errors.register.password.required')),
    new_password: Yup.string().required(translate('errors.register.password.new_password')),
    confirm_password: Yup.string().oneOf(
      [Yup.ref('new_password'), null],
      translate('errors.register.password.confirm_password')
    ),
  });

  const methods = useForm<UserInfoFormProps>({
    resolver: yupResolver(changePassword ? PasswordChangeSchema : RegisterSchema),
    defaultValues: useMemo(() => defaultValues, [defaultValues]),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
    getValues,
  } = methods;

  const onSubmitForm = async (data: UserInfoFormProps) => {
    let newPayload = { ...data };
    let newEntityMobile = getValues('mobile_number');

    newEntityMobile.substring(0, 4) !== '+966'
      ? (newEntityMobile = '+966'.concat(`${getValues('mobile_number')}`))
      : (newEntityMobile = getValues('mobile_number'));
    newPayload = { ...newPayload, mobile_number: newEntityMobile };

    const filteredObj = Object.fromEntries(
      Object.entries(newPayload).filter(([key, value]) => value)
    );
    delete filteredObj.confirm_password;
    onSubmit(filteredObj);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    let newValues = { ...defaultValues };
    const newEntityPhone = defaultValues.mobile_number?.replace('+966', '');
    newValues = { ...newValues, mobile_number: newEntityPhone };
    // console.log({ newValues });

    reset(newValues);
  }, [defaultValues, reset]);
  // console.log({ region });

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitForm)}>
      <Grid container rowSpacing={4} columnSpacing={7}>
        <Grid item md={12} xs={12}>
          <RHFTextField
            name="email"
            label={translate('register_form2.email.label')}
            placeholder={translate('register_form2.email.placeholder')}
          />
        </Grid>
        <Grid item md={8} xs={12}>
          <RHFPassword
            name="current_password"
            label={translate('register_form2.password.label')}
            placeholder={translate('register_form2.password.placeholder')}
          />
        </Grid>
        <Grid item md={4} xs={12} display="flex" alignItems="center">
          <Button
            size="large"
            onClick={() => setChangePassword(!changePassword)}
            variant={changePassword ? 'outlined' : 'contained'}
            sx={{
              backgroundColor: changePassword ? '#fff' : 'background.paper',
              color: changePassword ? 'background.paper' : '#fff',
              width: { xs: '100%', sm: '200px' },
              hieght: { xs: '100%', sm: '50px' },
            }}
          >
            {changePassword ? 'عدم تغيير كلمة المرور' : 'غير كلمة السر'}
          </Button>
        </Grid>

        {changePassword && (
          <>
            <Grid item md={6} xs={12}>
              <RHFPassword
                name="new_password"
                label={translate('register_form2.new_password.title')}
                placeholder={translate('register_form2.new_password.placeholder')}
              />
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
        <Grid item md={6} xs={12}>
          <RHFTextField
            name="employee_name"
            label={translate('register_form2.employee_name.label')}
            placeholder={translate('register_form2.employee_name.placeholder')}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <RHFTextField
            name="mobile_number"
            label={translate('register_form2.mobile_number.label')}
            // placeholder={translate('register_form2.mobile_number.placeholder')}
            placeholder="xxx xxx xxx"
          />
        </Grid>

        <Grid item md={12} xs={12} sx={{ mb: '70px' }}>
          {children}
        </Grid>
      </Grid>
    </FormProvider>
  );
};

export default UserInfoForm;

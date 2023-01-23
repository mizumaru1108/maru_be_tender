import * as Yup from 'yup';
import { Button, Grid, Typography } from '@mui/material';
import { FormProvider, RHFSelect, RHFTextField } from 'components/hook-form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ConnectingValuesProps } from '../../../../@types/register';
import { REGION } from '_mock/region';
import useLocales from 'hooks/useLocales';
import { RegionNames } from '../../../../@types/region';
import RHFPassword from 'components/hook-form/RHFPassword';
import { useEffect, useMemo, useState } from 'react';
import RHFSelectNoGenerator from '../../../../components/hook-form/RHFSelectNoGen';

type FormProps = {
  children?: React.ReactNode;
  onSubmit: (data: any) => void;
  defaultValues: ConnectingValuesProps;
  isEdit?: boolean;
};

const ConnectingInfoForm = ({ children, onSubmit, defaultValues, isEdit }: FormProps) => {
  const [changePassword, setChangePassword] = useState(false);
  const { translate } = useLocales();
  const RegisterSchema = Yup.object().shape({
    region: Yup.string().required('Region name required'),
    governorate: Yup.string().required('City name required'),
    center_administration: Yup.string().required('Center is required'),
    entity_mobile: Yup.string()
      .required('Mobile Number is required')
      .matches(
        /^\+9665[0-9]{8}$/,
        `The Entity Mobile must be written in the exact way of +9665xxxxxxxx`
      ),
    phone: Yup.string()
      .required('Phone Number required')
      .matches(
        /^\+9665[0-9]{8}$/,
        `The Entity Mobile must be written in the exact way of +9665xxxxxxxx`
      ),
    twitter_acount: Yup.string(),
    website: Yup.string(),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    // old_password: Yup.string().required('Old Password is required'),
    // new_password: Yup.string().required('New Password is required'),
    // confirm_password: Yup.string().oneOf([Yup.ref('new_password'), null], 'Passwords must match'),
  });
  const PasswordSchema = Yup.object().shape({
    region: Yup.string().required('Region name required'),
    governorate: Yup.string().required('City name required'),
    center_administration: Yup.string().required('Center is required'),
    entity_mobile: Yup.string()
      .required('Mobile Number is required')
      .matches(
        /^\+9665[0-9]{8}$/,
        `The Entity Mobile must be written in the exact way of +9665xxxxxxxx`
      ),
    phone: Yup.string()
      .required('Phone Number required')
      .matches(
        /^\+9665[0-9]{8}$/,
        `The Entity Mobile must be written in the exact way of +9665xxxxxxxx`
      ),
    twitter_acount: Yup.string(),
    website: Yup.string(),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    old_password: Yup.string().required('Old Password is required'),
    new_password: Yup.string().required('New Password is required'),
    confirm_password: Yup.string().oneOf([Yup.ref('new_password'), null], 'Passwords must match'),
  });

  const methods = useForm<ConnectingValuesProps>({
    resolver: yupResolver(changePassword ? PasswordSchema : RegisterSchema),
    defaultValues: useMemo(() => defaultValues, [defaultValues]),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    watch,
    reset,
    setValue,
  } = methods;

  const onSubmitForm = async (data: ConnectingValuesProps) => {
    onSubmit(data);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues]);
  const region = watch('region') as RegionNames | '';

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitForm)}>
      <Grid container rowSpacing={4} columnSpacing={7}>
        <Grid item md={6} xs={12}>
          <RHFSelectNoGenerator
            name="region"
            disabled={isEdit}
            label={translate('register_form2.region.label')}
            placeholder={translate('register_form2.region.placeholder')}
          >
            <>
              {Object.keys(REGION).map((item, index) => (
                <option key={index} value={item} style={{ backgroundColor: '#fff' }}>
                  {item}
                </option>
              ))}
            </>
          </RHFSelectNoGenerator>
        </Grid>
        <Grid item md={6} xs={12}>
          <RHFSelectNoGenerator
            name="governorate"
            disabled={isEdit}
            label={translate('register_form2.city.label')}
            placeholder={translate('register_form2.city.placeholder')}
          >
            {region !== '' && (
              <>
                {REGION[`${region}`].map((item: any, index: any) => (
                  <option key={index} value={item} style={{ backgroundColor: '#fff' }}>
                    {item}
                  </option>
                ))}
              </>
            )}
          </RHFSelectNoGenerator>
        </Grid>
        <Grid item md={6} xs={12}>
          <RHFTextField
            disabled={isEdit}
            name="center_administration"
            label={translate('register_form2.center.label')}
            placeholder={translate('register_form2.region.placeholder')}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <RHFTextField
            disabled
            name="entity_mobile"
            label={translate('register_form2.mobile_number.label')}
            placeholder={translate('register_form2.mobile_number.placeholder')}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <RHFTextField
            disabled
            name="phone"
            label={translate('register_form2.phone.label')}
            placeholder={translate('register_form2.phone.placeholder')}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <RHFTextField
            disabled={isEdit}
            name="twitter_acount"
            label={translate('register_form2.twitter.label')}
            placeholder={translate('register_form2.twitter.placeholder')}
          />
        </Grid>
        <Grid item md={12} xs={12}>
          <RHFTextField
            name="website"
            disabled={isEdit}
            label={translate('register_form2.website.label')}
            placeholder={translate('register_form2.website.placeholder')}
          />
        </Grid>
        <Grid item md={9} xs={9}>
          <RHFTextField
            disabled
            name="email"
            label={translate('register_form2.email.label')}
            placeholder={translate('register_form2.email.placeholder')}
          />
        </Grid>
        <Grid item md={3} xs={3} display="flex" alignItems="center">
          {/* <Typography variant="h5">كلمه السر</Typography> */}
          {/* <Button ></Button> */}
          <Button
            // type="submit"
            size="large"
            fullWidth
            variant="outlined"
            onClick={() => {
              setValue('old_password', '');
              setValue('new_password', '');
              setValue('confirm_password', '');
              setChangePassword(!changePassword);
            }}
            sx={{
              backgroundColor: 'background.paper',
              color: '#fff',
              width: { xs: '100%', sm: '200px' },
              hieght: { xs: '100%', sm: '50px' },
            }}
          >
            غير كلمة السر
          </Button>
        </Grid>
        {changePassword && (
          <>
            <Grid item md={12} xs={12}>
              <RHFPassword
                name="old_password"
                disabled={isEdit}
                label={translate('register_form2.old_password.title')}
                placeholder={translate('register_form2.old_password.placeholder')}
              />
            </Grid>
            <Grid item md={12} xs={12}>
              <RHFPassword
                name="new_password"
                disabled={isEdit}
                label={translate('register_form2.new_password.title')}
                placeholder={translate('register_form2.new_password.placeholder')}
              />
            </Grid>
            <Grid item md={12} xs={12}>
              <RHFPassword
                name="confirm_password"
                disabled={isEdit}
                label={translate('register_form2.new_password.title')}
                placeholder={translate('register_form2.new_password.placeholder')}
              />
            </Grid>
          </>
        )}
        <Grid item md={12} xs={12} sx={{ mb: '70px' }}>
          {children}
        </Grid>
      </Grid>
    </FormProvider>
  );
};

export default ConnectingInfoForm;

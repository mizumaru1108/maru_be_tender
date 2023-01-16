import * as Yup from 'yup';
import { Grid } from '@mui/material';
import { FormProvider, RHFSelect, RHFTextField } from 'components/hook-form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ConnectingValuesProps } from '../../../../@types/register';
import { REGION } from '_mock/region';
import useLocales from 'hooks/useLocales';
import { RegionNames } from '../../../../@types/region';
import RHFPassword from 'components/hook-form/RHFPassword';
import { useEffect, useMemo } from 'react';

type FormProps = {
  children?: React.ReactNode;
  onSubmit: (data: any) => void;
  defaultValues: ConnectingValuesProps;
};

const ConnectingInfoForm = ({ children, onSubmit, defaultValues }: FormProps) => {
  const { translate } = useLocales();
  const RegisterSchema = Yup.object().shape(
    {
      region: Yup.string().required('Region name required'),
      governorate: Yup.string().required('City name required'),
      center_administration: Yup.string(),
      entity_mobile: Yup.string()
        .required('Mobile Number is required')
        .matches(
          /^\+9665[0-9]{8}$/,
          `The Entity Mobile must be written in the exact way of +9665xxxxxxxx`
        ),
      phone: Yup.string()
        .nullable()
        .notRequired()
        .when('phone', {
          is: (value: string) => {
            console.log(value?.length);
            return value?.length;
          },
          then: (rule) =>
            rule.matches(
              /^\+9661[0-9]{8}$/,
              `The Entity Mobile must be written in the exact way of +9661xxxxxxxx`
            ),
        }),

      twitter_acount: Yup.string(),
      website: Yup.string(),
      email: Yup.string()
        .email('Email must be a valid email address')
        .required('Email is required'),
      password: Yup.string().required('Password is required'),
    },
    [
      // Add Cyclic deps here because when require itself
      ['phone', 'phone'],
    ]
  );

  const methods = useForm<ConnectingValuesProps>({
    resolver: yupResolver(RegisterSchema),
    defaultValues: useMemo(() => defaultValues, [defaultValues]),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    watch,
    reset,
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
          <RHFSelect
            name="region"
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
          </RHFSelect>
        </Grid>
        <Grid item md={6} xs={12}>
          <RHFSelect
            name="governorate"
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
          </RHFSelect>
        </Grid>
        <Grid item md={6} xs={12}>
          <RHFTextField
            name="center_administration"
            label={translate('register_form2.center.label')}
            placeholder={translate('register_form2.region.placeholder')}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <RHFTextField
            name="entity_mobile"
            label={translate('register_form2.mobile_number.label')}
            placeholder={translate('register_form2.mobile_number.placeholder')}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <RHFTextField
            name="phone"
            label={translate('register_form2.phone.label')}
            // placeholder={translate('register_form2.phone.placeholder')}
            placeholder="xxx-xxx-xxx"
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <RHFTextField
            name="twitter_acount"
            label={translate('register_form2.twitter.label')}
            placeholder={translate('register_form2.twitter.placeholder')}
          />
        </Grid>
        <Grid item md={12} xs={12}>
          <RHFTextField
            name="website"
            label={translate('register_form2.website.label')}
            placeholder={translate('register_form2.website.placeholder')}
          />
        </Grid>
        <Grid item md={12} xs={12}>
          <RHFTextField
            name="email"
            label="البريد الإلكتروني للجهة*"
            placeholder={translate('register_form2.email.placeholder')}
          />
        </Grid>
        <Grid item md={12} xs={12}>
          <RHFPassword
            name="password"
            label={translate('register_form2.password.label')}
            placeholder={translate('register_form2.password.placeholder')}
          />
        </Grid>
        <Grid item md={12} xs={12} sx={{ mb: '70px' }}>
          {children}
        </Grid>
      </Grid>
    </FormProvider>
  );
};

export default ConnectingInfoForm;

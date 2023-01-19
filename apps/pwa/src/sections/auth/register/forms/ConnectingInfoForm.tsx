import * as Yup from 'yup';
import { Grid, MenuItem } from '@mui/material';
import { FormProvider, RHFSelect, RHFTextField } from 'components/hook-form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ConnectingValuesProps } from '../../../../@types/register';
import { REGION } from '_mock/region';
import useLocales from 'hooks/useLocales';
import { RegionNames } from '../../../../@types/region';
import RHFPassword from 'components/hook-form/RHFPassword';
import { useEffect, useMemo, useState } from 'react';

type FormProps = {
  children?: React.ReactNode;
  onSubmit: (data: any) => void;
  defaultValues: ConnectingValuesProps;
};

const ConnectingInfoForm = ({ children, onSubmit, defaultValues }: FormProps) => {
  const { translate } = useLocales();

  useEffect(() => {
    window.scrollTo(0, 0);
    let newValues = { ...defaultValues };
    const newEntityMobile = defaultValues.entity_mobile?.replace('+966', '');
    const newPhone = defaultValues.phone?.replace('+966', '');
    newValues = { ...newValues, entity_mobile: newEntityMobile, phone: newPhone };
    reset(newValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues]);
  const RegisterSchema = Yup.object().shape(
    {
      region: Yup.string().required(translate('errors.register.region.required')),
      governorate: Yup.string().required(translate('errors.register.governorate.required')),
      center_administration: Yup.string(),
      entity_mobile: Yup.string()
        .required(translate('errors.register.entity_mobile.required'))
        .test('len', translate('errors.register.entity_mobile.length'), (val) => {
          if (val === undefined) {
            return true;
          }

          return val.length === 0 || val!.length === 9;
        }),
      // .matches(
      //   /^\+966[0-9]$/,
      //   `The Entity Mobile must be written in the exact way of +966xxxxxxxx`
      // ),
      phone: Yup.string()
        .nullable()
        .notRequired()
        .test('len', 'errors.register.phone.length', (val) => {
          if (val === undefined) {
            return true;
          }
          return val?.length === 0 || val!.length === 9;
        }),
      // .when('phone', {
      //   is: (value: string) => value?.length,
      //   then: (rule) =>
      //     rule.matches(
      //       /^\+966[0-9]$/,
      //       `Phone number must be written in the exact way of +966xxxxxxxx`
      //     ),
      // }),
      twitter_acount: Yup.string(),
      website: Yup.string(),
      email: Yup.string()
        .email(translate('errors.register.email.email'))
        .required(translate('errors.register.email.required')),
      password: Yup.string().required(translate('errors.register.password.required')),
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
    getValues,
  } = methods;

  const onSubmitForm = async (data: ConnectingValuesProps) => {
    let newEntityMobile = getValues('entity_mobile');
    let newPhoneValues = getValues('phone');

    newEntityMobile.substring(0, 4) !== '+966'
      ? (newEntityMobile = '+966'.concat(`${getValues('entity_mobile')}`))
      : (newEntityMobile = getValues('entity_mobile'));

    newPhoneValues!.substring(0, 4) !== '+966'
      ? (newPhoneValues = '+966'.concat(`${getValues('phone')}`))
      : (newPhoneValues = getValues('phone'));

    const payload: ConnectingValuesProps = {
      ...data,
      phone: newPhoneValues!,
      entity_mobile: newEntityMobile!,
    };

    // reset({ ...payload });
    onSubmit(payload);
  };

  // useEffect(() => {
  //   window.scrollTo(0, 0);
  //   reset(defaultValues);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [defaultValues]);
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
            {Object.keys(REGION).map((item, index) => (
              <MenuItem key={index} value={item}>
                {item}
              </MenuItem>
            ))}
          </RHFSelect>
        </Grid>
        <Grid item md={6} xs={12}>
          <RHFSelect
            name="governorate"
            label={translate('register_form2.city.label')}
            placeholder={translate('register_form2.city.placeholder')}
          >
            {region !== '' &&
              REGION[`${region}`].map((item: any, index: any) => (
                <MenuItem key={index} value={item}>
                  {item}
                </MenuItem>
              ))}
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
            // placeholder={translate('register_form2.mobile_number.placeholder')}
            placeholder="xxx-xxx-xxx"
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

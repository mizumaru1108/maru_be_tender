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
  const { translate } = useLocales();
  const RegisterSchema = Yup.object().shape({
    region: Yup.string().required('Region name required'),
    governorate: Yup.string().required('City name required'),
    center_administration: Yup.string().required('Center is required'),
    phone: Yup.string()
      .required(translate('errors.register.phone.required'))
      .test('len', translate('errors.register.phone.length'), (val) => {
        if (val === undefined) {
          return true;
        }

        return val.length === 0 || val!.length === 9;
      }),
    twitter_acount: Yup.string(),
    website: Yup.string(),
  });

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
    const newData = { ...data };
    const newPhone =
      data && data.phone && data.phone.split('')[4] === '+966' ? data.phone : `+966${data.phone}`;
    newData.phone = newPhone;
    console.log({ newData });
    onSubmit(newData);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    let newValues = { ...defaultValues };
    const newPhone = defaultValues.phone?.replace('+966', '');
    newValues = { ...newValues, phone: newPhone };
    // console.log({ newValues });
    reset(newValues);
  }, [defaultValues, reset]);
  const region = watch('region') as RegionNames | '';
  // console.log({ region });

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
            {region && !!region && (
              <>
                {REGION[`${region}`].map((item: any, index: any) => (
                  <option key={index} value={item} style={{ backgroundColor: '#fff' }}>
                    {item}
                  </option>
                ))}
              </>
            )}
            {region === '' && (
              <option value="" disabled selected style={{ backgroundColor: '#fff' }}>
                {translate('funding_project_request_form3.city.placeholder')}
              </option>
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
            disabled={isEdit}
            name="phone"
            label={translate('register_form2.phone.label')}
            placeholder={translate('register_form2.phone.placeholder')}
          />
        </Grid>
        <Grid item md={12} xs={12}>
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

        <Grid item md={12} xs={12} sx={{ mb: '70px' }}>
          {children}
        </Grid>
      </Grid>
    </FormProvider>
  );
};

export default ConnectingInfoForm;

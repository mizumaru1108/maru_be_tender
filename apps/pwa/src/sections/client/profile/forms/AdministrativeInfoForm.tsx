import * as Yup from 'yup';
import { Button, Grid, Stack } from '@mui/material';
import { FormProvider, RHFTextField } from 'components/hook-form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormGenerator from 'components/FormGenerator';
import { AdministrativeInfoData } from '../form-data';
import { AdministrativeValuesProps } from '../../../../@types/register';
import React from 'react';

type FormProps = {
  onSubmit: (data: any) => void;
  defaultValues: any;
  children?: React.ReactNode;
  isEdit?: boolean;
};

const AdministrativeInfoForm = ({ onSubmit, defaultValues, children, isEdit }: FormProps) => {
  const RegisterSchema = Yup.object().shape({
    ceo_name: Yup.string().required('Executive Director is required'),
    ceo_mobile: Yup.string()
      .required('CEO Mobile is required')
      .matches(
        /^\+9665[0-9]{8}$/,
        `The CEO Mobile must be written in the exact way of +9665xxxxxxxx`
      ),
    data_entry_name: Yup.string().required('Entery Data Name is required'),
    data_entry_mobile: Yup.string()
      .required('Data Entry Mobile is required')
      .matches(
        /^\+9665[0-9]{8}$/,
        `The Data Entry Mobile must be written in the exact way of +9665xxxxxxxx`
      ),
    data_entry_mail: Yup.string().email().required('Entery Data Email is required'),
  });

  const methods = useForm<AdministrativeValuesProps>({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    watch,
    reset,
  } = methods;

  const agree_on = watch('agree_on');
  const onSubmitForm = async (data: AdministrativeValuesProps) => {
    onSubmit(data);
  };
  React.useEffect(() => {
    window.scrollTo(0, 0);
    let newValues = { ...defaultValues };
    const newCeoMobile = defaultValues.ceo_mobile?.replace('+966', '');
    const newDataEntryMobile = defaultValues.data_entry_mobile?.replace('+966', '');
    const newChairmanMobile = defaultValues.chairman_mobile?.replace('+966', '');
    newValues = {
      ...newValues,
      ceo_mobile: newCeoMobile,
      data_entry_mobile: newDataEntryMobile,
      chairman_mobile: newChairmanMobile,
    };
    console.log('newValues', newValues);
    reset({ ...newValues });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues]);
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitForm)}>
      <Grid container rowSpacing={4} columnSpacing={7}>
        <Grid item md={6} xs={12}>
          <RHFTextField
            disabled={isEdit}
            name="ceo_name"
            label="register_form4.executive_director.label"
            placeholder="register_form4.executive_director.placeholder"
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <RHFTextField
            disabled={isEdit}
            name="ceo_mobile"
            label="register_form4.executive_director_mobile.label"
            placeholder="register_form4.executive_director_mobile.placeholder"
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <RHFTextField
            disabled={isEdit}
            name="data_entry_name"
            label="register_form4.entery_data_name.label"
            placeholder="register_form4.entery_data_name.placeholder"
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <RHFTextField
            disabled={isEdit}
            name="data_entry_mobile"
            label="register_form4.entery_data_phone.label"
            placeholder="register_form4.entery_data_phone.placeholder"
          />
        </Grid>
        <Grid item md={12} xs={12}>
          <RHFTextField
            disabled={isEdit}
            name="data_entry_mail"
            label="register_form4.entery_data_email.label"
            placeholder="register_form4.entery_data_email.placeholder"
          />
        </Grid>
        {/* <FormGenerator data={AdministrativeInfoData} /> */}
        <Grid item md={12} xs={12}>
          {children}
        </Grid>
      </Grid>
    </FormProvider>
  );
};

export default AdministrativeInfoForm;

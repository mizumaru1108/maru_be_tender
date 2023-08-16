import { yupResolver } from '@hookform/resolvers/yup';
import { Grid } from '@mui/material';
import { FormProvider, RHFTextField } from 'components/hook-form';
import RHFTextArea from 'components/hook-form/RHFTextArea';
import useLocales from 'hooks/useLocales';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { ContactUsGeneral } from './types';
interface Props {
  children?: React.ReactNode;
  defaultValuesForm?: ContactUsGeneral;
  onSubmitForm: (data: ContactUsGeneral) => void;
  isLoading: boolean;
}

const GeneralForm = ({ onSubmitForm, defaultValuesForm, children, isLoading }: Props) => {
  const { translate } = useLocales();
  const supportSchema = Yup.object().shape({
    title: Yup.string().required(translate('contact_support_form.errors.title.required')),
    message: Yup.string().required(translate('contact_support_form.errors.message.required')),
  });

  const defaultValues = {
    title: defaultValuesForm?.title || '',
    message: defaultValuesForm?.message || '',
  };
  const methods = useForm<ContactUsGeneral>({
    resolver: yupResolver(supportSchema),
    defaultValues,
  });

  const {
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // const inquiry_type = watch('inquiry_type');
  const onSubmit = async (data: ContactUsGeneral) => {
    // console.log('data', data);
    onSubmitForm(data);
  };
  // console.log('formType', formType);
  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container rowSpacing={4} columnSpacing={7}>
          <Grid item md={12} xs={12}>
            <RHFTextField
              name="title"
              label={translate('contact_support_form.message_title.label')}
              data-cy="contact_support_form.message_title"
              placeholder={translate('contact_support_form.message_title.placeholder')}
              disabled={isLoading}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <RHFTextArea
              name="message"
              label={translate('contact_support_form.message.label')}
              data-cy="contact_support_form.message"
              placeholder={translate('contact_support_form.message.placeholder')}
              disabled={isLoading}
            />
          </Grid>
          {children}
        </Grid>
      </FormProvider>
    </>
  );
};

export default GeneralForm;

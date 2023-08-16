import { yupResolver } from '@hookform/resolvers/yup';
import { Grid, MenuItem, TextField } from '@mui/material';
import { FormProvider, RHFSelect, RHFTextField } from 'components/hook-form';
import RHFTextArea from 'components/hook-form/RHFTextArea';
import useLocales from 'hooks/useLocales';
import React from 'react';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import BaseField from '../../../components/hook-form/BaseField';
import { ContactUsVisit } from './types';
interface Props {
  children?: React.ReactNode;
  defaultValuesForm?: ContactUsVisit;
  onSubmitForm: (data: ContactUsVisit) => void;
  isLoading: boolean;
}

const VisitationForm = ({ onSubmitForm, defaultValuesForm, children, isLoading }: Props) => {
  const { translate } = useLocales();
  const supportSchema = Yup.object().shape({
    date_of_visit: Yup.string().required(
      translate('contact_support_form.errors.date_of_visit.required')
    ),
    visit_reason: Yup.string().required(
      translate('contact_support_form.errors.visit_reason.required')
    ),
  });

  const defaultValues = {
    date_of_visit: defaultValuesForm?.date_of_visit || '',
    visit_reason: defaultValuesForm?.visit_reason || '',
  };
  const methods = useForm<ContactUsVisit>({
    resolver: yupResolver(supportSchema),
    defaultValues,
  });

  const {
    watch,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // const inquiry_type = watch('inquiry_type');
  const onSubmit = async (data: ContactUsVisit) => {
    // console.log('data', data);
    onSubmitForm(data);
  };
  // console.log('formType', formType);
  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container rowSpacing={4} columnSpacing={7}>
          <Grid item md={12} xs={12}>
            <BaseField
              type="datePicker"
              name="date_of_visit"
              label={translate('contact_support_form.date_of_visit.label')}
              data-cy="contact_support_form.date_of_visit"
              placeholder={translate('contact_support_form.date_of_visit.placeholder')}
              disabled={isLoading}
            />
          </Grid>
          <Grid item md={12} xs={12}>
            <BaseField
              type="textArea"
              name="visit_reason"
              label={translate('contact_support_form.visit_reason.label')}
              data-cy="contact_support_form.visit_reason"
              placeholder={translate('contact_support_form.visit_reason.placeholder')}
              disabled={isLoading}
            />
          </Grid>
          {children}
        </Grid>
      </FormProvider>
    </>
  );
};

export default VisitationForm;

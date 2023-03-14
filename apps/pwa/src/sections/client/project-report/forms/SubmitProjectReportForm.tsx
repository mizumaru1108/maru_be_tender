// react
import { useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
// @mui + component
import { Grid, Typography } from '@mui/material';
import { FormProvider, RHFDatePicker, RHFTextField } from 'components/hook-form';
import BaseField from 'components/hook-form/BaseField';
// hooks
import useLocales from 'hooks/useLocales';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { IPropFromProjectReport, CloseReportForm } from '../types';

// ------------------------------------------------------------------------------------------

export default function SubmitProjectReportForm({
  children,
  onSubmit,
  defaultValues,
  isEdit,
}: IPropFromProjectReport) {
  const { translate } = useLocales();
  const [tmpCloseReportValues, setTmpCloseReportValues] = useState<CloseReportForm>(defaultValues);

  const SubmitFormSchema = Yup.object().shape({
    number_of_beneficiaries: Yup.number()
      .positive()
      .integer()
      .min(1, translate('Number of beneficiaries must be at least 1'))
      .required('Number of beneficiaries is required'),
    target_beneficiaries: Yup.string().required('Target beneficiaries is required'),
    execution_place: Yup.string().required('Execution time is required'),
  });

  const methods = useForm<CloseReportForm>({
    resolver: yupResolver(SubmitFormSchema),
    defaultValues: useMemo(() => defaultValues, [defaultValues]),
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const onSubmitForm = async (data: CloseReportForm) => {
    setTmpCloseReportValues(data);
    // console.log('data', data);
    onSubmit(data);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitForm)}>
      <Grid container rowSpacing={4} columnSpacing={7}>
        <Grid item xs={12}>
          <Typography variant="body1" sx={{ fontWeight: 700 }}>
            {translate('pages.common.close_report.text.main_information')}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <RHFTextField
            disabled={isEdit}
            name="number_of_beneficiaries"
            type="number"
            size="medium"
            label={translate('register_form1.number_of_beneficiaries.label')}
            placeholder={translate('register_form1.number_of_beneficiaries.placeholder')}
          />
        </Grid>
      </Grid>
    </FormProvider>
  );
}

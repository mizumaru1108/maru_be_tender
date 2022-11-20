import { yupResolver } from '@hookform/resolvers/yup';
import { Grid } from '@mui/material';
import { FormProvider } from 'components/hook-form';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import FormGenerator from 'components/FormGenerator';
import { useEffect, useMemo } from 'react';
import { ThirdFormData } from './form-data';

type FormDataProps = {
  project_name: string;
  project_idea: string;
  project_goals: string;
  amount_required_fsupport: number;
  added_value: string;
  reasons_to_accept: string;
  project_beneficiaries: string;
  target_group_num: number;
  target_group_type: string;
  target_group_age: number;
  project_implement_date: string;
  execution_time: string;
  project_location: string;
  been_made_before: boolean;
  remote_or_insite: boolean;
};

function ThirdForm({ children, onSubmit, defaultValues }: any) {
  const validationSchema = Yup.object().shape({
    project_name: Yup.string().required('Procedures is required!'),
    project_idea: Yup.string().required('Procedures is required!'),
    project_goals: Yup.string().required('Procedures is required!'),
    amount_required_fsupport: Yup.number().required('Procedures is required!'),
    added_value: Yup.string().required('Procedures is required!'),
    reasons_to_accept: Yup.string().required('Procedures is required!'),
    project_beneficiaries: Yup.string().required('Procedures is required!'),
    target_group_num: Yup.number().required('Procedures is required!'),
    target_group_type: Yup.string().required('Procedures is required!'),
    target_group_age: Yup.number().required('Procedures is required!'),
    project_implement_date: Yup.string().required('Procedures is required!'),
    execution_time: Yup.string().required('Procedures is required!'),
    project_location: Yup.string().required('Procedures is required!'),
    been_made_before: Yup.boolean().required('Procedures is required!'),
    remote_or_insite: Yup.boolean().required('Procedures is required!'),
  });

  const methods = useForm<FormDataProps>({
    resolver: yupResolver(validationSchema),
    defaultValues: useMemo(() => defaultValues, [defaultValues]),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = methods;

  useEffect(() => {
    window.scrollTo(0, 0);
    reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultValues]);

  const onSubmitForm = async (data: any) => {
    onSubmit(data);
  };
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitForm)}>
      <Grid container rowSpacing={4} columnSpacing={7} sx={{ mt: '10px' }}>
        <FormGenerator data={ThirdFormData} />
        <Grid item xs={12}>
          {children}
        </Grid>
      </Grid>
    </FormProvider>
  );
}

export default ThirdForm;

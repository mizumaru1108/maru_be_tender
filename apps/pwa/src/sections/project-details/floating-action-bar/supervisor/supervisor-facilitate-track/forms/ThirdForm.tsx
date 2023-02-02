import { yupResolver } from '@hookform/resolvers/yup';
import { Grid } from '@mui/material';
import { FormProvider } from 'components/hook-form';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import FormGenerator from 'components/FormGenerator';
import { useMemo } from 'react';
import { ThirdFormData } from './form-data';
import { useSelector } from 'redux/store';
import { SupervisorStep3 } from '../../../../../../@types/supervisor-accepting-form';

function ThirdForm({ children, onSubmit }: any) {
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
    execution_time: Yup.number().required('Procedures is required!'),
    project_location: Yup.string().required('Procedures is required!'),
    been_made_before: Yup.boolean().required('Procedures is required!'),
    remote_or_insite: Yup.boolean().required('Procedures is required!'),
  });

  const { step3 } = useSelector((state) => state.supervisorAcceptingForm);

  const methods = useForm<SupervisorStep3>({
    resolver: yupResolver(validationSchema),
    defaultValues: useMemo(() => step3, [step3]),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = methods;

  const onSubmitForm = async (data: SupervisorStep3) => {
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

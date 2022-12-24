import { yupResolver } from '@hookform/resolvers/yup';
import { Grid } from '@mui/material';
import { FormProvider } from 'components/hook-form';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import FormGenerator from 'components/FormGenerator';
import { useMemo } from 'react';
import { SecondFormData } from './form-data';
import { useSelector } from 'redux/store';
import { SupervisorStep2 } from '../../../../../../@types/supervisor-accepting-form';

function SecondForm({ children, onSubmit }: any) {
  const validationSchema = Yup.object().shape({
    organizationName: Yup.string().required('Procedures is required!'),
    region: Yup.string().required('Procedures is required!'),
    governorate: Yup.string().required('Procedures is required!'),
    date_of_esthablistmen: Yup.string().required('Procedures is required!'),
    chairman_of_board_of_directors: Yup.string().required('Procedures is required!'),
    ceo: Yup.string().required('Procedures is required!'),
    been_supported_before: Yup.boolean().required('Procedures is required!'),
    most_clents_projects: Yup.string().required('Procedures is required!'),
    num_of_beneficiaries: Yup.number().required('Procedures is required!'),
  });

  const { step2 } = useSelector((state) => state.supervisorAcceptingForm);

  const methods = useForm<SupervisorStep2>({
    resolver: yupResolver(validationSchema),
    defaultValues: useMemo(() => step2, [step2]),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmitForm = async (data: SupervisorStep2) => {
    onSubmit(data);
  };
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitForm)}>
      <Grid container rowSpacing={4} columnSpacing={7} sx={{ mt: '10px' }}>
        <FormGenerator data={SecondFormData} />
        <Grid item xs={12}>
          {children}
        </Grid>
      </Grid>
    </FormProvider>
  );
}

export default SecondForm;

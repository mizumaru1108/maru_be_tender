import * as Yup from 'yup';
import { useEffect, useMemo } from 'react';
import { Grid } from '@mui/material';
import { FormProvider } from 'components/hook-form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormGenerator from 'components/FormGenerator';
import { ProjectInfoData } from '../Forms-Data';
type FormValuesProps = {
  num_ofproject_binicficiaries: number;
  project_goals: string;
  project_outputs: string;
  project_strengths: string;
  project_risks: string;
};

type Props = {
  onSubmit: (data: any) => void;
  children?: React.ReactNode;
  defaultValues: any;
};
const ProjectInfoForm = ({ onSubmit, children, defaultValues }: Props) => {
  const RegisterSchema = Yup.object().shape({
    num_ofproject_binicficiaries: Yup.number().required('Number of project beneficiaries required'),
    project_goals: Yup.string().required('Project goals required'),
    project_outputs: Yup.string().required('Project outputs is required'),
    project_strengths: Yup.string().required('Project strengths is required'),
    project_risks: Yup.string().required('Project risk is required'),
  });

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(RegisterSchema),
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
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container rowSpacing={4} columnSpacing={7}>
        <FormGenerator data={ProjectInfoData} />
        <Grid item xs={12}>
          {children}
        </Grid>
      </Grid>
    </FormProvider>
  );
};

export default ProjectInfoForm;

import * as Yup from 'yup';
import { useEffect, useMemo } from 'react';
import { Grid } from '@mui/material';
import { FormProvider } from 'components/hook-form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormGenerator from 'components/FormGenerator';
import { MainFormData } from '../Forms-Data';
import { CustomFile } from 'components/upload';

type FormValuesProps = {
  project_name: string;
  project_idea: string;
  project_location: string;
  project_implement_date: string;
  execution_time: string;
  project_beneficiaries: string;
  letter_ofsupport_req: CustomFile | string | null;
  project_attachments: CustomFile | string | null;
  project_beneficiaries_specific_type: string;
};

type Props = {
  onSubmit: (data: any) => void;
  children?: React.ReactNode;
  defaultValues: any;
};

const MainInfoForm = ({ onSubmit, children, defaultValues }: Props) => {
  const RegisterSchema = Yup.object().shape({
    project_name: Yup.string().required('Project name required'),
    project_idea: Yup.string().required('Project Idea name required'),
    project_location: Yup.string().required('Project location place is required'),
    project_implement_date: Yup.string().required('Project applying date is required'),
    execution_time: Yup.string().required('Applying duration name required'),
    project_beneficiaries: Yup.string().required('Target group type required'),
    letter_ofsupport_req: Yup.object().shape({
      url: Yup.string().required(),
      size: Yup.number(),
      type: Yup.string().required(),
    }),
    project_attachments: Yup.object().shape({
      url: Yup.string().required(),
      size: Yup.number(),
      type: Yup.string().required(),
    }),
    project_beneficiaries_specific_type: Yup.string(),
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
        <FormGenerator data={MainFormData} />
        <Grid item xs={12}>
          {children}
        </Grid>
      </Grid>
    </FormProvider>
  );
};

export default MainInfoForm;

import { yupResolver } from '@hookform/resolvers/yup';
import { Grid } from '@mui/material';
import { FormProvider } from 'components/hook-form';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import FormGenerator from 'components/FormGenerator';
import { useEffect, useMemo } from 'react';
import { SecondFormData } from './form-data';

type FormDataProps = {
  organizationName: string;
  region: string;
  governorate: string;
  date_of_esthablistmen: string;
  chairman_of_board_of_directors: string;
  ceo: string;
  been_supported_before: boolean;
  most_clents_projects: string;
  num_of_beneficiaries: number;
};

function SecondForm({ children, onSubmit, defaultValues }: any) {
  console.log(defaultValues);
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
        <FormGenerator data={SecondFormData} />
        <Grid item xs={12}>
          {children}
        </Grid>
      </Grid>
    </FormProvider>
  );
}

export default SecondForm;

import * as Yup from 'yup';
import { useEffect } from 'react';
import { Button, Grid, Stack, Box } from '@mui/material';
import { FormProvider } from 'components/hook-form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ReactComponent as MovingBack } from '../../../../assets/move-back-icon.svg';
import FormGenerator from 'components/FormGenerator';
import { ProjectInfoData } from '../Forms-Data';
type FormValuesProps = {
  number_of_project_beneficiaries: number;
  project_goals: string;
  project_outputs: string;
  project_strengths: string;
  project_risk: string;
};

type Props = {
  setStep: React.Dispatch<React.SetStateAction<number>>;
};
const ProjectInfoForm = ({ setStep }: Props) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const RegisterSchema = Yup.object().shape({
    number_of_project_beneficiaries: Yup.number().required(
      'Number of project beneficiaries required'
    ),
    project_goals: Yup.string().required('Project goals required'),
    project_outputs: Yup.string().required('Project outputs is required'),
    project_strengths: Yup.string().required('Project strengths is required'),
    project_risk: Yup.string().required('Project risk is required'),
  });
  const defaultValues = {
    number_of_project_beneficiaries: undefined,
    project_goals: '',
    project_outputs: '',
    project_strengths: '',
    project_risk: '',
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    setStep((prevStep) => prevStep + 1);
  };
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container rowSpacing={4} columnSpacing={7}>
        <FormGenerator data={ProjectInfoData} />
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="center">
            <Box
              sx={{
                borderRadius: 2,
                height: '90px',
                backgroundColor: '#fff',
                padding: '24px',
              }}
            >
              <Stack justifyContent="center" direction="row" gap={3}>
                <Button
                  onClick={() => {
                    setStep((prevStep) => (prevStep > 0 ? prevStep - 1 : prevStep));
                  }}
                  endIcon={<MovingBack />}
                  sx={{
                    color: 'text.primary',
                    width: { xs: '100%', sm: '200px' },
                    hieght: { xs: '100%', sm: '50px' },
                  }}
                >
                  رجوع
                </Button>
                <Box sx={{ width: '10px' }} />
                <Button
                  variant="outlined"
                  sx={{
                    color: 'text.primary',
                    width: { xs: '100%', sm: '200px' },
                    hieght: { xs: '100%', sm: '50px' },
                    borderColor: '#000',
                  }}
                >
                  حفظ كمسودة
                </Button>
                <Button
                  // type="submit"
                  onClick={() => {
                    setStep((prevStep) => (prevStep < 4 ? prevStep + 1 : prevStep));
                  }}
                  variant="outlined"
                  sx={{
                    backgroundColor: 'background.paper',
                    color: '#fff',
                    width: { xs: '100%', sm: '200px' },
                    hieght: { xs: '100%', sm: '50px' },
                  }}
                >
                  التالي
                </Button>
              </Stack>
            </Box>
          </Stack>
        </Grid>
      </Grid>
    </FormProvider>
  );
};

export default ProjectInfoForm;

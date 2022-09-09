import * as Yup from 'yup';
import { useEffect } from 'react';
import { Button, Grid, Stack, Box } from '@mui/material';
import { FormProvider } from 'components/hook-form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ReactComponent as MovingBack } from '../../../../assets/move-back-icon.svg';
import { ProjectBudgetData } from '../Forms-Data';
import FormGenerator from 'components/FormGenerator';
type FormValuesProps = {
  budget: {
    item: string;
    explanation: string;
    amount: number;
  }[];
};

type Props = {
  setStep: React.Dispatch<React.SetStateAction<number>>;
};

const ProjectBudgetForm = ({ setStep }: Props) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const RegisterSchema = Yup.object().shape({
    budget: Yup.array().of(
      Yup.object().shape({
        item: Yup.string().required(),
        explanation: Yup.string().required(),
        amount: Yup.number().required(),
      })
    ),
  });
  const defaultValues = {
    budget: [
      {
        item: '',
        explanation: '',
        amount: undefined,
      },
    ],
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
      <Grid container rowSpacing={4} columnSpacing={2}>
        <FormGenerator data={ProjectBudgetData} />
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="center">
            <Box
              sx={{
                borderRadius: 2,
                height: '90px',
                backgroundColor: '#fff',
                padding: '24px',
                mr: '60px',
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

export default ProjectBudgetForm;

import * as Yup from 'yup';
import { useEffect } from 'react';
import { Button, Grid, Stack, Box } from '@mui/material';
import { FormProvider } from 'components/hook-form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ReactComponent as MovingBack } from '../../../../assets/move-back-icon.svg';
import { ConnectingInfoData } from '../Forms-Data';
import FormGenerator from 'components/FormGenerator';
type FormValuesProps = {
  project_manager_name: string;
  mobile_number: number;
  email: string;
  region: string;
  city: string;
};

type Props = {
  setStep: React.Dispatch<React.SetStateAction<number>>;
};

const ConnectingInfoForm = ({ setStep }: Props) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const RegisterSchema = Yup.object().shape({
    project_manager_name: Yup.string().required('Project manager name is required'),
    mobile_number: Yup.number().required('Mobile number is required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    region: Yup.string().required('Region is required'),
    city: Yup.string().required('City is required'),
  });
  const defaultValues = {
    project_manager_name: '',
    mobile_number: undefined,
    email: '',
    region: '',
    city: '',
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
        <FormGenerator data={ConnectingInfoData} />
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

export default ConnectingInfoForm;

import * as Yup from 'yup';
import { Button, Grid, Stack } from '@mui/material';
import { FormProvider } from 'components/hook-form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormGenerator from 'components/FormGenerator';
import { LicenseInfoData } from '../register-shared/FormData';
import { LicenseValuesProps, Props, RegisterValues } from '../register-shared/register-types';

const LicenseInfoForm = ({ setStep, setRegisterState }: Props) => {
  const RegisterSchema = Yup.object().shape({
    license_number: Yup.string().required('License Number is required'),
    license_issue_date: Yup.string().required('License Issue Date is required'),
    license_expiry_date: Yup.string().required('License Expiry Date is required'),
    license_file: Yup.mixed().required('License File is required'),
    resolution_file: Yup.mixed().required('Resolution File is required'),
  });

  const defaultValues = {
    license_number: '',
    license_issue_date: '',
    license_expiry_date: '',
    license_file: undefined,
    resolution_file: undefined,
  };

  const methods = useForm<LicenseValuesProps>({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: LicenseValuesProps) => {
    setRegisterState((prevRegisterState: RegisterValues) => ({ ...prevRegisterState, ...data }));
    setStep((prevStep: number) => prevStep + 1);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container rowSpacing={4} columnSpacing={7}>
        <FormGenerator data={LicenseInfoData} />
        <Grid item md={12} xs={12} sx={{ mb: '10px' }}>
          <Stack justifyContent="center" direction="row" gap={2}>
            <Button
              onClick={() => {
                setStep((prevStep) => (prevStep > 0 ? prevStep - 1 : prevStep));
              }}
              sx={{
                color: '#000',
                size: 'large',
                width: { xs: '100%', sm: '200px' },
                hieght: { xs: '100%', sm: '50px' },
              }}
            >
              رجوع
            </Button>
            <Button
              onClick={() => {
                setStep((prevStep) => prevStep + 1);
              }}
              /**
               * for visiualization
               */
              // type="submit"
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
        </Grid>
      </Grid>
    </FormProvider>
  );
};

export default LicenseInfoForm;

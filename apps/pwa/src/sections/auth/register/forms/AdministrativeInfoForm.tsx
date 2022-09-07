import * as Yup from 'yup';
import { Button, Grid, Stack } from '@mui/material';
import { FormProvider } from 'components/hook-form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormGenerator from 'components/FormGenerator';
import { AdministrativeInfoData } from '../register-shared/FormData';
import {
  AdministrativeValuesProps,
  Props,
  RegisterValues,
} from '../register-shared/register-types';

const AdministrativeInfoForm = ({ setStep, setRegisterState }: Props) => {
  const RegisterSchema = Yup.object().shape({
    executive_director: Yup.string().required('Executive Director is required'),
    executive_director_mobile: Yup.string().required('Executive Director Mobile is required'),
    entery_data_name: Yup.string().required('Entery Data Name is required'),
    entery_data_phone: Yup.string().required('Entery Data Phone is required'),
    entery_data_email: Yup.string().required('Entery Data Email is required'),
    agree_on: Yup.boolean().required('Agreeing_On is required'),
  });

  const defaultValues = {
    executive_director: '',
    executive_director_mobile: '',
    entery_data_name: '',
    entery_data_phone: '',
    entery_data_email: '',
    agree_on: false,
  };

  const methods = useForm<AdministrativeValuesProps>({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: AdministrativeValuesProps) => {
    setRegisterState((prevRegisterState: RegisterValues) => ({ ...prevRegisterState, ...data }));
    setStep((prevStep) => prevStep + 1);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container rowSpacing={4} columnSpacing={7}>
        <FormGenerator data={AdministrativeInfoData} />
        <Grid item md={12} xs={12}>
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
              // type="submit"
              onClick={() => {
                setStep((prevStep) => prevStep + 1);
              }}
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

export default AdministrativeInfoForm;

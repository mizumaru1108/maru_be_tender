import * as Yup from 'yup';
import { Button, Grid, Stack } from '@mui/material';
import { FormProvider } from 'components/hook-form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import FormGenerator from 'components/FormGenerator';
import { BankingInfoData } from '../register-shared/FormData';
import { BankingValuesProps, Props, RegisterValues } from '../register-shared/register-types';

const BankingInfoForm = ({ setStep, setRegisterState }: Props) => {
  const RegisterSchema = Yup.object().shape({
    bank_account_number: Yup.number().required('Bank Account Number required'),
    bank_account_name: Yup.string().required('Bank Account name required'),
    bank_name: Yup.string().required('Bank Name is required'),
    bank_account_card_image: Yup.mixed().required('Bank Account Card Image is required'),
  });

  const defaultValues = {
    bank_account_number: undefined,
    bank_account_name: '',
    bank_name: '',
    bank_account_card_image: undefined,
  };

  const methods = useForm<BankingValuesProps>({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: BankingValuesProps) => {
    setRegisterState((prevRegisterState: RegisterValues) => ({ ...prevRegisterState, ...data }));
    setStep((prevStep) => prevStep + 1);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container rowSpacing={4} columnSpacing={7}>
        <FormGenerator data={BankingInfoData} />
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

export default BankingInfoForm;

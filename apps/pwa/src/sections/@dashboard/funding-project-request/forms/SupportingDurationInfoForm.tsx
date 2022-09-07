import * as Yup from 'yup';
import { useEffect } from 'react';
import { Box, Button, Grid, Stack, Paper } from '@mui/material';
import { FormProvider, RHFCheckbox } from 'components/hook-form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { BankImage } from '../../../../assets';
import { LoadingButton } from '@mui/lab';
import { ReactComponent as MovingBack } from '../../../../assets/move-back-icon.svg';
import BankImageComp from 'sections/shared/BankImageComp';

type FormValuesProps = {
  test1: string;
  test2: string;
  budget?: Record<string, any>[];
};

type Props = {
  setStep: React.Dispatch<React.SetStateAction<number>>;
};
const SupportingDurationInfoForm = ({ setStep }: Props) => {
  const RegisterSchema = Yup.object().shape({
    test1: Yup.string(),
    test2: Yup.string(),
    budget: Yup.array(),
  });
  const defaultValues = {
    test1: '',
    test2: '',
    budget: [{ field: '', explanation: '', cost: '' }],
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(RegisterSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    console.log(data);
    // setStep((prevStep) => prevStep + 1);
  };

  const styles = {
    paperContainer: {
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundSize: 'inherit',
      backgroundImage: `url(${BankImage})`,
      width: '360px',
      height: '180px',
    },
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container rowSpacing={4} columnSpacing={7}>
        <Grid item md={6} xs={12}>
          <BankImageComp
            enableButton={true}
            accountNumber={'0000 0000 0000 0000'}
            bankAccountName={'اسم الحساب البنكي'}
            bankName={'البنك السعودي للاستثمار'}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <BankImageComp
            enableButton={true}
            accountNumber={'0000 0000 0000 0000'}
            bankAccountName={'اسم الحساب البنكي'}
            bankName={'البنك السعودي للاستثمار'}
          />
        </Grid>
        <Grid item xs={12}>
          <Stack justifyContent="center">
            <Button sx={{ textDecoration: 'underline', margin: '0 auto' }}>
              اضافة تفاصيل بنك جديد
            </Button>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <RHFCheckbox
            name=""
            label="أقر بصحة المعلومات الواردة في هذا النموذج وأتقدم بطلب دعم المشروع"
          />
        </Grid>
        <Grid item xs={12} sx={{ mt: '10px' }}>
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

export default SupportingDurationInfoForm;

import * as Yup from 'yup';
import { useEffect, useState } from 'react';
import { Button, Grid, Stack } from '@mui/material';
import { FormProvider, RHFCheckbox } from 'components/hook-form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { BankImage } from '../../../assets';
import BankImageComp from 'sections/shared/BankImageComp';
import { FormProps } from '../../shared/types';
import AddBankModal from '../funding-project-request/forms/AddBankModal';

type FormValuesProps = {
  test1: string;
  test2: string;
  budget?: Record<string, any>[];
};

const BankingInfoForm = ({ children, onSubmit }: FormProps) => {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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

  const onSubmitForm = async (data: FormValuesProps) => {
    onSubmit(data);
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
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitForm)}>
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
            <Button sx={{ textDecoration: 'underline', margin: '0 auto' }} onClick={handleOpen}>
              اضافة تفاصيل بنك جديد
            </Button>
            <AddBankModal open={open} handleClose={handleClose} />
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <RHFCheckbox
            name=""
            label="أقر بصحة المعلومات الواردة في هذا النموذج وأتقدم بطلب دعم المشروع"
          />
        </Grid>
        <Grid item xs={12} sx={{ mt: '10px' }}>
          {children}
        </Grid>
      </Grid>
    </FormProvider>
  );
};

export default BankingInfoForm;

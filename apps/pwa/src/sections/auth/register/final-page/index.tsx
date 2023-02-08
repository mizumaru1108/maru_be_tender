import { Stack, Typography, Container, Button } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import axios from 'axios';
import { useState } from 'react';
import * as React from 'react';
import useAuth from 'hooks/useAuth';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router';
import { AccountValuesProps } from 'sections/shared/types';
import MainInfo from './MainInfo';
import ConnectionInfo from './ConnectionInfo';
import LicenseInfo from './LicenseInfo';
import AdministrativeInfo from './AdministrativeInfo';
import BankInformation from './BankInformation';
import { TMRA_RAISE_URL } from 'config';
import useLocales from 'hooks/useLocales';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function FinalPage({
  registerState,
  setStep,
}: {
  registerState: AccountValuesProps;
  setStep: (val: number) => void;
}) {
  const { login } = useAuth();
  const { translate } = useLocales();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState('');
  const [isSending, setIsSending] = useState(false);
  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
  const hanelSubmit = async () => {
    setIsSending(true);
    const { form1, form2, form3, form4, form5 } = registerState;
    const { phone, center_administration, ...restForm2 } = form2;
    const newVal: any = {
      // employee_name: registerState.form1.entity,
      // employee_path: ,
      // bank_informations: [
      //   {
      //     bank_account_number: form5.bank_account_number,
      //     bank_account_name: form5.bank_account_name,
      //     bank_name: form5.bank_name,
      //     card_image: form5.card_image,
      //   },
      // ],
      // ...form1,
      // ...restForm2,
      // ...(phone !== '' && { phone }),
      // ...(center_administration !== '' && { center_administration }),
      // license_number: form3.license_number,
      // license_issue_date: form3.license_issue_date,
      // license_expired: form3.license_expired,
      // license_file: form3.license_file,
      // board_ofdec_file: form3.board_ofdec_file,
      // ...form4,
      employee_name: registerState.form1.entity,
      bank_informations: {
        bank_account_number: form5.bank_account_number,
        bank_account_name: form5.bank_account_name,
        bank_name: form5.bank_name,
        card_image: form5.card_image,
      },
      ...form1,
      ...restForm2,
      ...(phone !== '' && { phone }),
      ...(center_administration !== '' && { center_administration }),
      license_number: form3.license_number,
      license_issue_date: form3.license_issue_date,
      license_expired: form3.license_expired,
      license_file: form3.license_file,
      board_ofdec_file: form3.board_ofdec_file,
      ...form4,
    };
    delete newVal.used_numbers;
    // console.log({ newVal });
    try {
      await axios
        .post(`${TMRA_RAISE_URL}/tender-auth/register`, {
          data: newVal,
        })
        .then(async (res) => {
          if (res.data.statusCode <= 300) {
            await login(registerState.form2.email, registerState.form2.password);
            navigate('/');
          }
        })
        .catch((err) => {
          setErrors(err.response.data.message);
          setOpen(true);
          setIsSending(false);
        });
    } catch (error) {
      setErrors(error.response.data.message);
      setOpen(true);
      setIsSending(false);
    }
  };
  return (
    <Container sx={{ py: '20px' }}>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="error">{errors}</Alert>
      </Snackbar>
      <Stack direction="column" gap={4}>
        <Typography variant="h4">إنشاء حساب جديد - التفاصيل كاملة</Typography>
        <MainInfo data={registerState.form1} setStep={setStep} />
        <ConnectionInfo data={registerState.form2} setStep={setStep} />
        <LicenseInfo data={registerState.form3} setStep={setStep} />
        <AdministrativeInfo data={registerState.form4} setStep={setStep} />
        <BankInformation data={registerState.form5} setStep={setStep} />
        <Stack justifyContent="center" direction="row" gap={2} sx={{ height: '40px' }}>
          <Button
            sx={{
              color: '#000',
              size: 'large',
              width: { xs: '100%', sm: '200px' },
              hieght: { xs: '100%', sm: '50px' },
            }}
            onClick={() => {
              setStep(4);
            }}
          >
            {translate('going_back_one_step')}
          </Button>
          <LoadingButton
            fullWidth
            size="large"
            variant="contained"
            loading={isSending}
            onClick={hanelSubmit}
            sx={{
              backgroundColor: 'background.paper',
              color: '#fff',
              width: { xs: '100%', sm: '200px' },
              hieght: { xs: '100%', sm: '50px' },
            }}
          >
            {translate('create_new_account')}
          </LoadingButton>
        </Stack>
      </Stack>
    </Container>
  );
}

export default FinalPage;

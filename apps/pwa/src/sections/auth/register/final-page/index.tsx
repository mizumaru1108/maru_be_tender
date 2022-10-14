import { Stack, Typography, Container, Button } from '@mui/material';
import { createClient } from 'queries/auth/createClient';
import { useMutation } from 'urql';
import { nanoid } from 'nanoid';
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
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [open, setOpen] = useState(false);
  const [_, updateTodo] = useMutation(createClient);
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
    try {
      const { data } = await axios.post(
        'https://api-staging.tmra.io/v2/raise/auth/fusion/regTender',
        {
          data: {
            id: nanoid(),
            employee_name: registerState.form2.email,
            employee_path: registerState.form2.email,
            bank_informations: [
              {
                ...form5,
              },
            ],
            status: 'WAITING_FOR_ACTIVATION',
            ...form1,
            ...form2,
            ...form3,
            ...form4,
          },
          roles: ['tender_client'],
        }
      );
      await login(registerState.form2.email, registerState.form2.password);
      navigate('/');
    } catch (error) {
      setErrors(error.message);
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
          >
            رجوع
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
            انشاء حساب
          </LoadingButton>
        </Stack>
      </Stack>
    </Container>
  );
}

export default FinalPage;

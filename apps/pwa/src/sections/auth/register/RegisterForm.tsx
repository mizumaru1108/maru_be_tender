import * as Yup from 'yup';
import { useState } from 'react';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import {
  Stack,
  IconButton,
  InputAdornment,
  Alert,
  Step,
  StepLabel,
  Typography,
  Stepper,
  Box,
  alpha,
  Button,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// hooks
import useAuth from '../../../hooks/useAuth';
import useIsMountedRef from '../../../hooks/useIsMountedRef';
// components
import Iconify from '../../../components/Iconify';
import { FormProvider, RHFTextField } from '../../../components/hook-form';
import MainForm from './MainForm';
import ConnectingInfoForm from './ConnectingInfoForm';
import LicenseInfoForm from './LicenseInfoForm';
import AdministrativeInfoForm from './AdministrativeInfoForm';
import BankingInfoForm from './BankingInfoForm';
// ----------------------------------------------------------------------

type FormValuesProps = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  afterSubmit?: string;
};

export default function RegisterForm() {
  const { register } = useAuth();

  const isMountedRef = useIsMountedRef();

  const [step, setStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);

  const RegisterSchema = Yup.object().shape({
    firstName: Yup.string().required('First name required'),
    lastName: Yup.string().required('Last name required'),
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const defaultValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
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
    try {
      await register(data.email, data.password, data.firstName, data.lastName);
    } catch (error) {
      console.error(error);
      reset();
      if (isMountedRef.current) {
        setError('afterSubmit', { ...error, message: error.message });
      }
    }
  };

  return (
    <>
      <Box
        sx={{
          width: '100%',
          backgroundColor: alpha('#919EAB', 0.16),
          padding: 3,
          borderTopLeftRadius: 15,
          borderBottomLeftRadius: 15,
          mb: 5,
        }}
      >
        <Stepper activeStep={step}>
          {[
            'المعلومات الرئيسية',
            'معلومات الاتصال',
            'معلومات الترخيص',
            'بيانات الإدارية',
            'معلومات البنكية',
          ].map((label, index) => (
            <Step key={index}>
              <StepLabel>
                <Typography sx={{ fontFamily: 'Cairo', fontStyle: 'Bold' }}>{label}</Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      {step === 0 && <MainForm setStep={setStep} />}
      {step === 1 && <ConnectingInfoForm setStep={setStep} />}
      {step === 2 && <LicenseInfoForm setStep={setStep} />}
      {step === 3 && <AdministrativeInfoForm setStep={setStep} />}
      {step === 4 && <BankingInfoForm setStep={setStep} />}
    </>
  );
}

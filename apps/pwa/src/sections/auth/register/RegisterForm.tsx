import { useState } from 'react';
import { Step, StepLabel, Typography, Stepper, Box, alpha } from '@mui/material';
import {
  MainForm,
  ConnectingInfoForm,
  LicenseInfoForm,
  AdministrativeInfoForm,
  BankingInfoForm,
  FinalPage,
} from './forms';
import useResponsive from 'hooks/useResponsive';
import useLocales from 'hooks/useLocales';
import { RegisterValues } from './register-shared/register-types';
// ----------------------------------------------------------------------

const taps = [
  'register_first_tap',
  'register_second_tap',
  'register_third_tap',
  'register_fourth_tap',
  'register_fifth_tap',
];

const initialValue = {
  entity_area: '',
  authority: '',
  date_of_establishment: '',
  headquarters: '',
  number_of_employees: undefined,
  number_of_beneficiaries: undefined,
  region: '',
  city: '',
  phone: '',
  twitter: '',
  website: '',
  email: '',
  password: '',
  license_number: undefined,
  license_issue_date: '',
  license_expiry_date: '',
  license_file: null,
  resolution_file: null,
  executive_director: '',
  executive_director_mobile: '',
  entery_data_name: '',
  entery_data_phone: '',
  entery_data_email: '',
  agree_on: false,
  bank_account_number: undefined,
  bank_account_name: '',
  bank_name: '',
  bank_account_card_image: null,
} as RegisterValues;
export default function RegisterForm() {
  const { translate } = useLocales();
  const isMobile = useResponsive('down', 'sm');
  const [step, setStep] = useState(0);

  const [registerState, setRegisterState] = useState(initialValue);

  return (
    <>
      {step !== 5 && (
        <Box
          sx={{
            width: '100%',
            backgroundColor: alpha('#919EAB', 0.16),
            padding: 3,
            borderTopLeftRadius: 15,
            borderBottomLeftRadius: 15,
            mb: 5,
            display: isMobile ? 'none' : 'table-row-group',
          }}
        >
          <Stepper activeStep={step} connector={null}>
            {taps.map((label, index) => (
              <Step key={index}>
                <StepLabel>
                  <Typography sx={{ fontFamily: 'Cairo', fontStyle: 'Bold' }}>
                    {translate(label)}
                  </Typography>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
      )}
      {step === 0 && <MainForm setStep={setStep} setRegisterState={setRegisterState} />}
      {step === 1 && <ConnectingInfoForm setStep={setStep} setRegisterState={setRegisterState} />}
      {step === 2 && <LicenseInfoForm setStep={setStep} setRegisterState={setRegisterState} />}
      {step === 3 && (
        <AdministrativeInfoForm setStep={setStep} setRegisterState={setRegisterState} />
      )}
      {step === 4 && <BankingInfoForm setStep={setStep} setRegisterState={setRegisterState} />}
      {step === 5 && <FinalPage {...registerState} />}
    </>
  );
}

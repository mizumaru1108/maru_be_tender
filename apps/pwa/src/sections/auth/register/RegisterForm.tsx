import { useState } from 'react';
import { Step, StepLabel, Typography, Stepper, Box, alpha, Stack, Link } from '@mui/material';
import {
  MainForm,
  ConnectingInfoForm,
  LicenseInfoForm,
  AdministrativeInfoForm,
  BankingInfoForm,
} from '../../shared';
import useResponsive from 'hooks/useResponsive';
import useLocales from 'hooks/useLocales';
import {
  AccountValuesProps,
  AdministrativeValuesProps,
  BankingValuesProps,
  ConnectingValuesProps,
  LicenseValuesProps,
  MainValuesProps,
} from '../../shared/types';
import ActionsBox from './ActionsBox';
import FinalPage from './final-page';
import { Link as RouterLink } from 'react-router-dom';
// ----------------------------------------------------------------------

const taps = [
  'register_first_tap',
  'register_second_tap',
  'register_third_tap',
  'register_fourth_tap',
  'register_fifth_tap',
];

const initialValue = {
  form1: {
    client_field: '',
    entity: '',
    authority: '',
    date_of_esthablistmen: '',
    headquarters: '',
    num_of_employed_facility: undefined,
    num_of_beneficiaries: undefined,
  },
  form2: {
    region: '',
    governorate: '',
    center_administration: '',
    entity_mobile: '',
    phone: '',
    twitter_acount: '',
    website: '',
    email: '',
    password: '',
  },
  form3: {
    license_number: '',
    license_issue_date: '',
    license_expired: '',
    license_file: { size: undefined, url: '', type: '' },
    board_ofdec_file: { size: undefined, url: '', type: '' },
  },
  form4: {
    agree_on: false,
    ceo_name: '',
    ceo_mobile: '',
    data_entry_name: '',
    data_entry_mobile: '',
    data_entry_mail: '',
  },
  form5: {
    bank_account_number: '',
    bank_account_name: '',
    bank_name: '',
    card_image: { size: undefined, url: '', type: '' },
  },
} as AccountValuesProps;
export default function RegisterForm() {
  const { translate } = useLocales();
  const isMobile = useResponsive('down', 'sm');
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [registerState, setRegisterState] = useState(initialValue);

  const onSubmit1 = (data: MainValuesProps) => {
    setStep((prevStep) => prevStep + 1);
    setRegisterState((prevRegisterState: AccountValuesProps) => ({
      ...prevRegisterState,
      form1: {
        ...prevRegisterState.form1,
        ...data,
      },
    }));
    if (done) setStep(5);
  };

  const onSubmit2 = (data: ConnectingValuesProps) => {
    setStep((prevStep) => prevStep + 1);
    setRegisterState((prevRegisterState: AccountValuesProps) => ({
      ...prevRegisterState,
      form2: {
        ...prevRegisterState.form1,
        ...data,
      },
    }));
    if (done) setStep(5);
  };

  const onSubmit3 = (data: LicenseValuesProps) => {
    setStep((prevStep) => prevStep + 1);
    setRegisterState((prevRegisterState: AccountValuesProps) => ({
      ...prevRegisterState,
      form3: {
        ...prevRegisterState.form1,
        ...data,
      },
    }));
    if (done) setStep(5);
  };

  const onSubmit4 = (data: AdministrativeValuesProps) => {
    setStep((prevStep) => prevStep + 1);
    setRegisterState((prevRegisterState: AccountValuesProps) => ({
      ...prevRegisterState,
      form4: {
        ...prevRegisterState.form1,
        ...data,
      },
    }));
    if (done) setStep(5);
  };

  const onSubmit5 = (data: BankingValuesProps) => {
    setStep((prevStep) => prevStep + 1);
    setRegisterState((prevRegisterState: AccountValuesProps) => ({
      ...prevRegisterState,
      form5: {
        ...prevRegisterState.form5,
        ...data,
      },
    }));
    setDone(true);
  };
  const onReturn = () => {
    if (step > 0) setStep((prevStep) => prevStep - 1);
  };
  return (
    <>
      {step !== 5 && (
        <Stack direction="row" justifyContent="space-between">
          <Typography
            variant="h4"
            gutterBottom
            sx={{ fontFamily: 'Cairo', fontStyle: 'Bold', mt: 5 }}
          >
            {translate('create_new_account')}
          </Typography>
          <Link
            variant="subtitle2"
            component={RouterLink}
            to={'/auth/login'}
            sx={{ textDecorationLine: 'underline', mt: 5 }}
          >
            تسجيل الدخول
          </Link>
        </Stack>
      )}
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
      {step === 0 && (
        <MainForm onSubmit={onSubmit1} defaultValues={registerState.form1}>
          <ActionsBox done={done} onReturn={onReturn} />
        </MainForm>
      )}
      {step === 1 && (
        <ConnectingInfoForm onSubmit={onSubmit2} defaultValues={registerState.form2}>
          <ActionsBox done={done} onReturn={onReturn} />
        </ConnectingInfoForm>
      )}
      {step === 2 && (
        <LicenseInfoForm onSubmit={onSubmit3} defaultValues={registerState.form3}>
          <ActionsBox done={done} onReturn={onReturn} />
        </LicenseInfoForm>
      )}
      {step === 3 && (
        <AdministrativeInfoForm
          onReturn={onReturn}
          onSubmit={onSubmit4}
          defaultValues={registerState.form4}
          done={done}
        />
      )}
      {step === 4 && (
        <BankingInfoForm onSubmit={onSubmit5} defaultValues={registerState.form5}>
          <ActionsBox done={done} onReturn={onReturn} />
        </BankingInfoForm>
      )}
      {step === 5 && <FinalPage registerState={registerState} setStep={setStep} />}
    </>
  );
}

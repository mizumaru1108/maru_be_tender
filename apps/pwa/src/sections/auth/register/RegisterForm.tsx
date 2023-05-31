import { useEffect, useState } from 'react';
import {
  Step,
  StepLabel,
  Typography,
  Stepper,
  Box,
  alpha,
  Stack,
  Link,
  Container,
} from '@mui/material';
import {
  ConnectingInfoForm,
  MainForm,
  LicenseInfoForm,
  AdministrativeInfoForm,
  BankingInfoForm,
} from './forms';
import useResponsive from 'hooks/useResponsive';
import useLocales from 'hooks/useLocales';
import {
  AccountValuesProps,
  AdministrativeValuesProps,
  BankingValuesProps,
  ConnectingValuesProps,
  LicenseValuesProps,
  MainValuesProps,
} from '../../../@types/register';
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
    num_of_employed_facility: 0,
    num_of_beneficiaries: 0,
    vat: false,
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
    used_numbers: [],
  },
  form3: {
    license_number: '',
    license_issue_date: '',
    license_expired: '',
    license_file: {
      url: '',
      size: undefined,
      type: '',
      base64Data: '',
      fileExtension: '',
      fullName: '',
    },
    board_ofdec_file: {
      url: '',
      size: undefined,
      type: '',
      base64Data: '',
      fileExtension: '',
      fullName: '',
    },
  },
  form4: {
    agree_on: false,
    ceo_name: '',
    ceo_mobile: '',
    chairman_name: '',
    chairman_mobile: '',
    data_entry_name: '',
    data_entry_mobile: '',
    data_entry_mail: '',
    used_numbers: [],
  },
  form5: {
    bank_account_number: '',
    bank_account_name: '',
    bank_name: '',
    card_image: { size: undefined, url: '', type: '' },
  },
  used_numbers: {
    form2: [],
    form4: [],
  },
} as AccountValuesProps;
export default function RegisterForm() {
  const { translate } = useLocales();
  const isMobile = useResponsive('down', 'sm');
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [registerState, setRegisterState] = useState(initialValue);

  const onSubmit1 = (data: MainValuesProps) => {
    // console.log({ data });
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
        ...prevRegisterState.form2,
        ...data,
      },
      used_numbers: {
        // ...prevRegisterState.used_numbers,
        form2: [...data.used_numbers!],
        form4: [...prevRegisterState.used_numbers!.form4],
      },
    }));
    if (done) setStep(5);
  };

  const onSubmit3 = (data: LicenseValuesProps) => {
    // console.log({ data });
    setStep((prevStep) => prevStep + 1);
    setRegisterState((prevRegisterState: AccountValuesProps) => ({
      ...prevRegisterState,
      form3: {
        ...prevRegisterState.form3,
        ...data,
      },
    }));
    if (done) setStep(5);
  };

  const onSubmit4 = (data: AdministrativeValuesProps) => {
    // console.log({ data });
    setStep((prevStep) => prevStep + 1);
    setRegisterState((prevRegisterState: AccountValuesProps) => ({
      ...prevRegisterState,
      form4: {
        ...prevRegisterState.form4,
        ...data,
      },
      // used_numbers: [...prevRegisterState.used_numbers!, ...data.used_numbers!],
      used_numbers: {
        // ...prevRegisterState.used_numbers,
        form2: [...prevRegisterState.used_numbers!.form2],
        form4: [...data.used_numbers!],
      },
    }));
    if (done) setStep(5);
  };

  const onSubmit5 = (data: BankingValuesProps) => {
    // console.log({ data });
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
  // useEffect(() => {
  //   console.log('wathc used numbers', registerState.used_numbers);
  // }, [registerState.used_numbers]);
  return (
    <>
      {step !== 5 && (
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ my: 3 }}>
          <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Cairo', fontStyle: 'Bold' }}>
            {translate('create_new_account')}
          </Typography>
          <Link
            variant="subtitle2"
            component={RouterLink}
            to={'/auth/login'}
            sx={{ textDecorationLine: 'underline', alignSelf: 'center' }}
          >
            {translate('login')}
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
        <Container sx={{ padding: '10px' }}>
          <MainForm onSubmit={onSubmit1} defaultValues={registerState.form1}>
            <ActionsBox done={done} onReturn={onReturn} />
          </MainForm>
        </Container>
      )}
      {step === 1 && (
        <Container sx={{ padding: '10px' }}>
          <ConnectingInfoForm
            onSubmit={onSubmit2}
            defaultValues={registerState.form2}
            usedNumbers={registerState.used_numbers?.form4}
          >
            <ActionsBox done={done} onReturn={onReturn} />
          </ConnectingInfoForm>
        </Container>
      )}
      {step === 2 && (
        <Container sx={{ padding: '10px' }}>
          <LicenseInfoForm onSubmit={onSubmit3} defaultValues={registerState.form3}>
            <ActionsBox done={done} onReturn={onReturn} />
          </LicenseInfoForm>
        </Container>
      )}
      {step === 3 && (
        <AdministrativeInfoForm
          onReturn={onReturn}
          onSubmit={onSubmit4}
          defaultValues={registerState.form4}
          done={done}
          usedNumbers={registerState.used_numbers?.form2}
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

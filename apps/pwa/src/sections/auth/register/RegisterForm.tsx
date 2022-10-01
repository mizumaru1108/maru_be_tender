import { useState } from 'react';
import { Step, StepLabel, Typography, Stepper, Box, alpha } from '@mui/material';
import {
  MainForm,
  ConnectingInfoForm,
  LicenseInfoForm,
  AdministrativeInfoForm,
  BankingInfoForm,
} from '../../shared';
import useResponsive from 'hooks/useResponsive';
import useLocales from 'hooks/useLocales';
import { AccountValuesProps } from '../../shared/types';
import ActionsBox from './ActionsBox';
import FinalPage from './FinalPage';
// ----------------------------------------------------------------------

const taps = [
  'register_first_tap',
  'register_second_tap',
  'register_third_tap',
  'register_fourth_tap',
  'register_fifth_tap',
];

const initialValue = {
  agree_on: false,
  entity: '',
  authority: '',
  date_of_esthablistmen: '',
  headquarters: '',
  num_of_employed_facility: undefined,
  num_of_beneficiaries: undefined,
  region: '',
  governorate: '',
  center_administration: '',
  entity_mobile: '',
  phone: '',
  twitter_acount: '',
  website: '',
  email: '',
  password: '',
  license_number: undefined,
  license_issue_date: '',
  license_expired: '',
  license_file: '',
  board_ofdec_file: '',
  ceo_name: '',
  ceo_mobile: '',
  data_entry_name: '',
  data_entry_mobile: '',
  data_entry_mail: '',
  bank_account_number: '',
  bank_account_name: '',
  bank_name: '',
  card_image: '',
} as AccountValuesProps;
export default function RegisterForm() {
  const { translate } = useLocales();
  const isMobile = useResponsive('down', 'sm');
  const [step, setStep] = useState(3);

  const [registerState, setRegisterState] = useState(initialValue);

  const onSubmit = (data: any) => {
    setStep((prevStep) => prevStep + 1);
    setRegisterState((prevRegisterState: AccountValuesProps) => ({
      ...prevRegisterState,
      ...data,
    }));
  };
  const onReturn = () => {
    if (step > 0) setStep((prevStep) => prevStep - 1);
  };
  return (
    <>
      {step !== 5 && (
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontFamily: 'Cairo', fontStyle: 'Bold', mt: 5 }}
        >
          {translate('create_new_account')}
        </Typography>
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
        <MainForm onSubmit={onSubmit}>
          <ActionsBox onReturn={onReturn} />
        </MainForm>
      )}
      {step === 1 && (
        <ConnectingInfoForm onSubmit={onSubmit}>
          <ActionsBox onReturn={onReturn} />
        </ConnectingInfoForm>
      )}
      {step === 2 && (
        <LicenseInfoForm onSubmit={onSubmit}>
          <ActionsBox onReturn={onReturn} />
        </LicenseInfoForm>
      )}
      {step === 3 && (
        <AdministrativeInfoForm onSubmit={onSubmit}>
          <ActionsBox onReturn={onReturn} />
        </AdministrativeInfoForm>
      )}
      {step === 4 && (
        <BankingInfoForm onSubmit={onSubmit}>
          <ActionsBox onReturn={onReturn} />
        </BankingInfoForm>
      )}
      {step === 5 && <FinalPage {...registerState} />}
    </>
  );
}

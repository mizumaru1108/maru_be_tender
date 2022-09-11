import { Box, IconButton, Typography, alpha, Stack, Button } from '@mui/material';
import useLocales from 'hooks/useLocales';
import useResponsive from 'hooks/useResponsive';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  AdministrativeInfoForm,
  LicenseInfoForm,
  MainForm,
  ConnectingInfoForm,
} from 'sections/shared';
import { AccountValuesProps } from '../../shared/types';
import ActionsBox from './ActionsBox';
import Toast from 'components/toast';
import BankingInfoForm from './BankingInfoForm';

const taps = [
  'register_first_tap',
  'register_second_tap',
  'register_third_tap',
  'register_fourth_tap',
  'register_fifth_tap',
];

function ClientProfileEditForm() {
  const navigate = useNavigate();
  const isMobile = useResponsive('down', 'sm');
  const [step, setStep] = useState(0);
  const { translate } = useLocales();
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
  } as AccountValuesProps;
  const [registerState, setRegisterState] = useState(initialValue);
  const [open, setOpen] = useState(false);
  const onSubmit = () => {
    setOpen(true);
  };
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Stack direction="row">
        <IconButton
          onClick={() => {
            navigate('/client/my-profile');
          }}
        >
          <svg
            width="42"
            height="41"
            viewBox="0 0 42 41"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              width="40.6799"
              height="41.53"
              rx="2"
              transform="matrix(-1.19249e-08 -1 -1 1.19249e-08 41.5312 40.6798)"
              fill="#93A3B0"
              fill-opacity="0.24"
            />
            <path
              d="M16.0068 12.341C16.0057 12.5165 16.0394 12.6904 16.1057 12.8529C16.1721 13.0153 16.2698 13.1631 16.3934 13.2877L22.5134 19.3944C22.6384 19.5183 22.7376 19.6658 22.8053 19.8283C22.873 19.9907 22.9078 20.165 22.9078 20.341C22.9078 20.517 22.873 20.6913 22.8053 20.8538C22.7376 21.0163 22.6384 21.1637 22.5134 21.2877L16.3934 27.3944C16.1423 27.6454 16.0013 27.986 16.0013 28.341C16.0013 28.6961 16.1423 29.0366 16.3934 29.2877C16.6445 29.5388 16.985 29.6798 17.3401 29.6798C17.5159 29.6798 17.69 29.6452 17.8524 29.5779C18.0148 29.5106 18.1624 29.412 18.2868 29.2877L24.3934 23.1677C25.1235 22.4078 25.5312 21.3948 25.5312 20.341C25.5312 19.2872 25.1235 18.2743 24.3934 17.5144L18.2868 11.3944C18.1628 11.2694 18.0153 11.1702 17.8529 11.1025C17.6904 11.0348 17.5161 11 17.3401 11C17.1641 11 16.9898 11.0348 16.8273 11.1025C16.6648 11.1702 16.5174 11.2694 16.3934 11.3944C16.2698 11.5189 16.1721 11.6667 16.1057 11.8291C16.0394 11.9916 16.0057 12.1655 16.0068 12.341Z"
              fill="#1E1E1E"
            />
          </svg>
        </IconButton>
      </Stack>
      <Typography variant="h4">تعديل بيانات الحساب</Typography>
      <Box
        sx={{
          width: '100%',
          backgroundColor: alpha('#919EAB', 0.16),
          borderTopLeftRadius: '10px',
          borderBottomLeftRadius: '15px',
          mb: 5,
          display: isMobile ? 'none' : 'flex',
          flexDirection: 'row',
          height: '75px',
        }}
      >
        {taps.map((label, index) => (
          <Button
            sx={{
              color: index === step ? '#fff' : '#93A3B0',
              backgroundColor: index === step ? 'text.tertiary' : undefined,
              height: '75px',
              alignItems: 'center',
              borderTopLeftRadius: step !== 0 ? '0px' : '10px',
              borderBottomLeftRadius: step !== 0 ? '0px' : '10px',
              borderTopRightRadius: '0px',
              borderBottomRightRadius: '0px',
            }}
            key={index}
            onClick={() => {
              setStep(index);
            }}
          >
            {translate(label)}
          </Button>
        ))}
      </Box>

      {step === 0 && (
        <Box sx={{ px: '100px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Typography variant="h5">المعلومات الرئيسية</Typography>
          <MainForm onSubmit={onSubmit}>
            <ActionsBox />
          </MainForm>
        </Box>
      )}
      {step === 1 && (
        <Box sx={{ px: '100px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Typography variant="h5">معلومات الاتصال</Typography>
          <ConnectingInfoForm onSubmit={onSubmit}>
            <ActionsBox />
          </ConnectingInfoForm>
        </Box>
      )}
      {step === 2 && (
        <Box sx={{ px: '100px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Typography variant="h5">معلومات الترخيص</Typography>
          <LicenseInfoForm onSubmit={onSubmit}>
            <ActionsBox />
          </LicenseInfoForm>
        </Box>
      )}
      {step === 3 && (
        <Box sx={{ px: '100px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Typography variant="h5">بيانات ادارية</Typography>
          <AdministrativeInfoForm onSubmit={onSubmit}>
            <ActionsBox />
          </AdministrativeInfoForm>
        </Box>
      )}
      {step === 4 && (
        <Box sx={{ px: '100px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Typography variant="h5">معلومات بنكية</Typography>
          <BankingInfoForm onSubmit={onSubmit}>
            <ActionsBox />
          </BankingInfoForm>
        </Box>
      )}
      <Toast
        variant="standard"
        toastType="success"
        message="تم التعديل بنجاح"
        autoHideDuration={3000}
        isOpen={open}
        position="bottom-right"
        onClose={() => {
          setOpen(false);
        }}
      />
    </Box>
  );
}

export default ClientProfileEditForm;

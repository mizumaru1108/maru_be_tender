import { Box, IconButton, Typography, Stack, Button, Tabs, Tab } from '@mui/material';
import useLocales from 'hooks/useLocales';
import {
  AccountEditValuesProps,
  AccountValuesProps,
  AdministrativeValuesProps,
  BankingValuesProps,
  ConnectingValuesProps,
  LicenseValuesProps,
  MainValuesProps,
} from '../../../@types/register';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  MainForm,
  ConnectingInfoForm,
  LicenseInfoForm,
  AdministrativeInfoForm,
  BankingInfoForm,
} from './forms';
import ActionsBox from './ActionsBox';
import Toast from 'components/toast';
import { useTheme } from '@mui/material/styles';
import { useQuery } from 'urql';
import { gettingUserDataForEdit } from 'queries/client/gettingUserDataForEdit';
import useAuth from 'hooks/useAuth';
const taps = [
  'register_first_tap',
  'register_second_tap',
  'register_third_tap',
  'register_fourth_tap',
  'register_fifth_tap',
];

function ClientProfileEditForm() {
  const theme = useTheme();
  const { user } = useAuth();
  const id = user?.id;
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const { translate } = useLocales();
  const [result] = useQuery({ query: gettingUserDataForEdit, variables: { id } });
  const { data, fetching, error } = result;
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
      license_file: {
        url: '',
        size: undefined,
        type: '',
        base64Data: '',
        fileExtension: '',
        fullName: '',
      },
      board_ofdec_file: { size: undefined, url: '', type: '' },
    },
    form4: {
      ceo_name: '',
      ceo_mobile: '',
      data_entry_name: '',
      data_entry_mobile: '',
      data_entry_mail: '',
    },
    form5: [
      {
        bank_account_number: '',
        bank_account_name: '',
        bank_name: '',
        card_image: { size: undefined, url: '', type: '' },
        id,
      },
    ],
  } as AccountEditValuesProps;
  const [profileState, setProfileState] = useState(initialValue);
  const [open, setOpen] = useState(false);
  const onSubmit = () => {
    setOpen(true);
    window.scrollTo(0, 0);
  };
  const handleTapChange = (event: React.SyntheticEvent, newValue: number) => {
    setStep(newValue);
  };
  useEffect(() => {
    if (data?.user_by_pk) {
      const { client_data: client, bank_informations, email } = data?.user_by_pk;
      const {
        client_field,
        entity,
        authority,
        date_of_esthablistmen,
        headquarters,
        num_of_beneficiaries,
        num_of_employed_facility,
        // second form
        region,
        governorate,
        center_administration,
        entity_mobile,
        phone,
        twitter_acount,
        website,
        password,
        // third form
        license_number,
        license_issue_date,
        license_expired,
        license_file,
        board_ofdec_file,
        //fourth form
        ceo_name,
        ceo_mobile,
        data_entry_name,
        data_entry_mobile,
        data_entry_mail,
      } = client;
      setProfileState((prevState) => ({
        ...prevState,
        form1: {
          ...prevState.form1,
          client_field,
          entity,
          authority,
          date_of_esthablistmen,
          headquarters,
          num_of_beneficiaries,
          num_of_employed_facility,
        },
        form2: {
          ...prevState.form2,
          region,
          governorate,
          center_administration,
          entity_mobile,
          phone,
          twitter_acount,
          website,
          email: email.trim(),
          password,
        },
        form3: {
          ...prevState.form3,
          license_number,
          license_issue_date,
          license_expired,
          license_file: { size: undefined, url: license_file, type: 'application/pdf' },
          board_ofdec_file: { size: undefined, url: board_ofdec_file, type: 'application/pdf' },
        },
        form4: {
          ...prevState.form4,
          ceo_name,
          ceo_mobile,
          data_entry_name,
          data_entry_mobile,
          data_entry_mail,
        },
        form5: bank_informations,
      }));
    }
  }, [data]);

  const onSubmit1 = (data: MainValuesProps) => {
    setOpen(true);
    window.scrollTo(0, 0);
    console.log(data);
    setProfileState((prevProfileState: AccountEditValuesProps) => ({
      ...prevProfileState,
      form1: {
        ...prevProfileState.form1,
        ...data,
      },
    }));
  };

  const onSubmit2 = (data: ConnectingValuesProps) => {
    setOpen(true);
    window.scrollTo(0, 0);
    setProfileState((prevProfileState: AccountEditValuesProps) => ({
      ...prevProfileState,
      form2: {
        ...prevProfileState.form2,
        ...data,
      },
    }));
  };

  const onSubmit3 = (data: LicenseValuesProps) => {
    setOpen(true);
    window.scrollTo(0, 0);
    console.log(data);
    setProfileState((prevProfileState: AccountEditValuesProps) => ({
      ...prevProfileState,
      form3: {
        ...prevProfileState.form3,
        ...data,
      },
    }));
  };

  const onSubmit4 = (data: AdministrativeValuesProps) => {
    setOpen(true);
    window.scrollTo(0, 0);
    setProfileState((prevProfileState: AccountEditValuesProps) => ({
      ...prevProfileState,
      form4: {
        ...prevProfileState.form4,
        ...data,
      },
    }));
  };

  const onSubmit5 = (data: BankingValuesProps) => {
    setOpen(true);
    window.scrollTo(0, 0);
    setProfileState((prevProfileState: AccountEditValuesProps) => ({
      ...prevProfileState,
      form5: {
        ...prevProfileState.form5,
        ...data,
      },
    }));
  };

  const onDeleteBankInformation = (index: number) => {
    setProfileState((prevProfileState: AccountEditValuesProps) => ({
      ...prevProfileState,
      form5: prevProfileState.form5.filter((item, indx) => indx !== index),
    }));
  };
  console.log(profileState);
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
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h4">تعديل بيانات الحساب</Typography>
        <Button
          sx={{
            color: '#fff',
            backgroundColor: 'background.paper',
          }}
        >
          إرسال التعديلات
        </Button>
      </Stack>

      <Tabs
        value={step}
        onChange={handleTapChange}
        indicatorColor="primary"
        textColor="inherit"
        sx={{
          bgcolor: '#93A3B029',
          borderRadius: 1,
        }}
      >
        {taps.map((label, index) => (
          <Tab
            key={index}
            label={translate(label)}
            sx={{
              borderRadius: 0,
              px: 3,
              '&.MuiTab-root:not(:last-of-type)': {
                marginRight: 0,
              },
              '&.Mui-selected': {
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
              },
            }}
          />
        ))}
      </Tabs>
      {fetching && <>... Loading</>}
      {step === 0 && !fetching && (
        <Box sx={{ px: '100px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Typography variant="h5">المعلومات الرئيسية</Typography>
          <MainForm onSubmit={onSubmit1} defaultValues={profileState.form1}>
            <ActionsBox />
          </MainForm>
        </Box>
      )}
      {step === 1 && (
        <Box sx={{ px: '100px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Typography variant="h5">معلومات الاتصال</Typography>
          <ConnectingInfoForm onSubmit={onSubmit2} defaultValues={profileState.form2}>
            <ActionsBox />
          </ConnectingInfoForm>
        </Box>
      )}
      {step === 2 && (
        <Box sx={{ px: '100px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Typography variant="h5">معلومات الترخيص</Typography>
          <LicenseInfoForm onSubmit={onSubmit3} defaultValues={profileState.form3}>
            <ActionsBox />
          </LicenseInfoForm>
        </Box>
      )}
      {step === 3 && (
        <Box sx={{ px: '100px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Typography variant="h5">بيانات ادارية</Typography>
          <AdministrativeInfoForm onSubmit={onSubmit4} defaultValues={profileState.form4}>
            <ActionsBox />
          </AdministrativeInfoForm>
        </Box>
      )}
      {step === 4 && (
        <Box sx={{ px: '100px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Typography variant="h5">معلومات بنكية</Typography>
          <BankingInfoForm
            onDelete={onDeleteBankInformation}
            onSubmit={onSubmit}
            initialValue={profileState.form5}
          >
            <ActionsBox />
          </BankingInfoForm>
        </Box>
      )}
      <Toast
        variant="outlined"
        toastType="success"
        message="تم التأكد من المعلومات أنها صحيحة, لحفظ تعديلاتك الرجاء الضغط على إرسال التعديلات أعلاه"
        autoHideDuration={10000}
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

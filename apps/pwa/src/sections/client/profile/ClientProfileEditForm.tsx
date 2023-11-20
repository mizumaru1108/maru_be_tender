import { LoadingButton } from '@mui/lab';
import { Box, Button, Stack, Tab, Tabs, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import { useSnackbar } from 'notistack';
import { gettingUserDataForEdit } from 'queries/client/gettingUserDataForEdit';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useQuery } from 'urql';
import { removeEmptyKey } from 'utils/remove-empty-key';
import { BankInformation } from '../../../@types/proposal';
import {
  AdministrativeValuesProps,
  BankingValuesProps,
  ConnectingValuesProps,
  LicenseValuesProps,
  MainValuesProps,
} from '../../../@types/register';
import { FileProp } from '../../../components/upload';
import axiosInstance from '../../../utils/axios';
import ActionsBox from './ActionsBox';
import {
  AdministrativeInfoForm,
  BankingInfoForm,
  ConnectingInfoForm,
  LicenseInfoForm,
  MainForm,
} from './forms';
import Iconify from 'components/Iconify';
const taps = [
  'register_first_tap',
  'register_second_tap',
  'register_third_tap',
  'register_fourth_tap',
  'register_fifth_tap',
];

interface editedTabs {
  form1: string;
  form2: string;
  form3: string;
  form4: string;
  form5: string;
  numberOfUpdatedBanks?: number;
}

export interface SubmitBankForm {
  created_banks?: BankingValuesProps[];
  updated_banks?: BankingValuesProps[];
  deleted_banks?: BankingValuesProps[];
}

function ClientProfileEditForm() {
  const theme = useTheme();
  const { user, activeRole } = useAuth();
  const id = user?.id;
  const [result] = useQuery({ query: gettingUserDataForEdit, variables: { id } });
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [step, setStep] = useState(0);
  const [editedTabs, setEditedTabs] = useState<editedTabs>({
    form1: '',
    form2: '',
    form3: '',
    form4: '',
    form5: '',
    numberOfUpdatedBanks: 0,
  });
  const { translate, currentLang } = useLocales();
  const { data, fetching, error } = result;
  const initialValue = {
    form1: {
      client_field: '',
      entity: '',
      authority: '',
      authority_id: '',
      date_of_esthablistmen: '',
      headquarters: '',
      num_of_employed_facility: undefined,
      num_of_beneficiaries: undefined,
    },
    form2: {
      region: '',
      region_id: '',
      governorate: '',
      governorate_id: '',
      center_administration: '',
      phone: '',
      twitter_acount: '',
      website: '',
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
      board_ofdec_file: [],
    },
    form4: {
      ceo_name: '',
      ceo_mobile: '',
      data_entry_name: '',
      data_entry_mobile: '',
      data_entry_mail: '',
      chairman_name: '',
      chairman_mobile: '',
    },
    form5: [
      {
        bank_account_number: '',
        bank_account_name: '',
        bank_name: '',
        bank_id: '',
        card_image: {
          url: '',
          size: undefined,
          type: '',
          base64Data: '',
          fileExtension: '',
          fullName: '',
        },
        id,
      },
    ],
    updated_banks: [],
    created_banks: [],
    deleted_banks: [],
  };
  const [profileState, setProfileState] = useState(initialValue);
  const [open, setOpen] = useState(false);
  const [LoadingButtonState, setLoadingButtonState] = useState(false);
  const [isEdit, setIsEdit] = useState({
    form1: false,
    form2: false,
    form3: false,
    form4: false,
    form5: false,
  });
  const [startedValue, setStartedValue] = useState<any>();

  const handleTapChange = (event: React.SyntheticEvent, newValue: number) => {
    setStep(newValue);
  };

  useEffect(() => {
    if (data?.user_by_pk?.client_data && data?.user_by_pk?.email) {
      const { client_data: client, bank_informations } = data?.user_by_pk;
      const checkedBanks = bank_informations.findIndex(
        (bank: any) => bank && bank.bank_list && bank.bank_list.is_deleted
      );
      const numberOfBank = bank_informations.filter(
        (bank: any) => bank && bank.bank_list && bank.bank_list.is_deleted
      );
      if (checkedBanks > -1) {
        setEditedTabs((editedTabs) => ({
          ...editedTabs,
          form5: 'register_fifth_tap',
          numberOfUpdatedBanks: numberOfBank.length,
        }));
        setStep(4);
      }
      const {
        client_field,
        client_field_id,
        entity,
        authority,
        authority_id,
        date_of_esthablistmen,
        headquarters,
        num_of_beneficiaries,
        num_of_employed_facility,
        // second form
        region,
        region_id,
        governorate,
        governorate_id,
        center_administration,
        entity_mobile,
        phone,
        twitter_acount,
        website,
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
        chairman_name,
        chairman_mobile,
        //
      } = client;
      setStartedValue({ bank_informations, ...client });
      let newval: any = [];
      if (board_ofdec_file instanceof Array && board_ofdec_file.length > 0) {
        newval = [...board_ofdec_file];
      } else if (typeof board_ofdec_file === 'object') {
        newval.push(board_ofdec_file);
      }
      const tmpLicenseFile = license_file?.url
        ? license_file
        : {
            url: '',
            size: undefined,
            type: '',
            base64Data: '',
            fileExtension: '',
            fullName: '',
          };
      // console.log({ tmpLicenseFile });
      setProfileState((prevState: any) => ({
        ...prevState,
        form1: {
          ...prevState.form1,
          client_field,
          client_field_id,
          entity,
          authority: authority,
          date_of_esthablistmen,
          headquarters,
          num_of_beneficiaries,
          num_of_employed_facility,
          authority_id: authority_id,
        },
        form2: {
          ...prevState.form2,
          region,
          region_id,
          governorate,
          governorate_id,
          center_administration,
          entity_mobile,
          phone,
          twitter_acount,
          website,
        },
        form3: {
          ...prevState.form3,
          license_number,
          license_issue_date,
          license_expired,
          license_file: {
            ...tmpLicenseFile,
          },
          board_ofdec_file: newval,
          // {
          //   ...board_ofdec_file,
          // },
        },
        form4: {
          ...prevState.form4,
          ceo_name,
          ceo_mobile,
          data_entry_name,
          data_entry_mobile,
          data_entry_mail,
          chairman_name,
          chairman_mobile,
        },
        form5: bank_informations,
      }));
    }
  }, [data]);

  // console.log({ profileState });

  const onSubmit1 = (data: MainValuesProps) => {
    window.scrollTo(0, 0);
    if (isEdit && isEdit.form1) {
      setIsEdit((prevIsEdit: any) => ({
        ...prevIsEdit,
        form1: false,
      }));
    }
    if (isEdit && !isEdit.form1) {
      setOpen(true);
      setIsEdit((prevIsEdit: any) => ({
        ...prevIsEdit,
        form1: true,
      }));
      setProfileState((prevProfileState: any) => ({
        ...prevProfileState,
        form1: {
          ...prevProfileState.form1,
          ...data,
        },
      }));
    }
  };

  const onSubmit2 = (data: ConnectingValuesProps) => {
    window.scrollTo(0, 0);
    if (isEdit && isEdit.form2) {
      setIsEdit((prevIsEdit: any) => ({
        ...prevIsEdit,
        form2: false,
      }));
    }
    if (isEdit && !isEdit.form2) {
      setOpen(true);
      setIsEdit((prevIsEdit: any) => ({
        ...prevIsEdit,
        form2: true,
      }));
      setProfileState((prevProfileState: any) => ({
        ...prevProfileState,
        form2: {
          ...data,
        },
      }));
    }
  };

  const onSubmit3 = (data: LicenseValuesProps) => {
    window.scrollTo(0, 0);
    const checkBoardOfDec =
      startedValue &&
      startedValue?.board_ofdec_file &&
      startedValue?.board_ofdec_file.length > 0 &&
      startedValue?.board_ofdec_file.every((item: any) => !!item)
        ? true
        : false;
    if (isEdit && isEdit.form3) {
      let defaultBoardofDec: FileProp[] = [];
      if (checkBoardOfDec) {
        defaultBoardofDec.push(...startedValue.board_ofdec_file);
      }
      setIsEdit((prevIsEdit: any) => ({
        ...prevIsEdit,
        form3: false,
      }));
    }
    if (isEdit && !isEdit.form3) {
      setOpen(true);
      setIsEdit((prevIsEdit: any) => ({
        ...prevIsEdit,
        form3: true,
      }));
      setProfileState((prevProfileState: any) => ({
        ...prevProfileState,
        form3: {
          ...prevProfileState.form3,
          ...data,
        },
      }));
    }
  };

  const onSubmit4 = (data: AdministrativeValuesProps) => {
    window.scrollTo(0, 0);
    if (isEdit && isEdit.form4) {
      setIsEdit((prevIsEdit: any) => ({
        ...prevIsEdit,
        form4: false,
      }));
    }
    if (isEdit && !isEdit.form4) {
      setOpen(true);
      setIsEdit((prevIsEdit: any) => ({
        ...prevIsEdit,
        form4: true,
      }));
      setProfileState((prevProfileState: any) => ({
        ...prevProfileState,
        form4: {
          ...prevProfileState.form4,
          ...data,
        },
      }));
    }
  };

  const onSubmit5 = (data: any) => {
    window.scrollTo(0, 0);
    if (isEdit && isEdit.form5) {
      let defaultBank: BankingValuesProps[] = [];
      defaultBank.push(
        ...(startedValue && startedValue.bank_informations && startedValue.bank_informations)
      );
      setIsEdit((prevIsEdit: any) => ({
        ...prevIsEdit,
        form5: false,
      }));
    }
    if (isEdit && !isEdit.form5) {
      let mergeArray: BankingValuesProps[] = [];
      if (
        (data as BankingValuesProps[]).length > 0 &&
        !data.created_banks &&
        !data.updated_banks &&
        !data.updated_banks
      ) {
        mergeArray = data as BankingValuesProps[];
      } else {
        if (data && data?.created_banks) {
          if (data?.created_banks?.length > 0) {
            const tmpCreatedBanks =
              data?.created_banks && data?.created_banks.map((item: any) => item);
            mergeArray = [...mergeArray, ...tmpCreatedBanks];
          }
        }
        if (data && data?.updated_banks) {
          if (data?.updated_banks?.length! > 0) {
            const tmpUpdatedBanks =
              data?.updated_banks && data?.updated_banks.map((item: any) => item);
            mergeArray = [...mergeArray, ...tmpUpdatedBanks];
          }
        }
        if (data && data?.deleted_banks) {
          if (data?.deleted_banks?.length! > 0) {
            const tmpDeletedBanks =
              data?.deleted_banks && data?.deleted_banks.map((item: any) => item);
            mergeArray = [...mergeArray, ...tmpDeletedBanks];
          }
        }
        if (
          data &&
          data?.created_banks?.length === 0 &&
          data?.updated_banks?.length === 0 &&
          data?.deleted_banks?.length === 0
        ) {
          mergeArray = profileState.form5;
        }
      }
      setOpen(true);
      setIsEdit((prevIsEdit: any) => ({
        ...prevIsEdit,
        form5: true,
      }));
      setProfileState((prevProfileState: any) => ({
        ...prevProfileState,
        ...data,
        form5: mergeArray,
      }));
    }
  };

  const onDeleteBankInformation = (index: number) => {
    setProfileState((prevProfileState: any) => ({
      ...prevProfileState,
      form5: prevProfileState.form5.filter((item: any, indx: any) => indx !== index),
    }));
  };

  const onSubmitEditRequest = async () => {
    setLoadingButtonState(true);
    let newBankInformation = {};
    if (startedValue.bank_informations && startedValue.bank_informations.length > 0) {
      const tmpUpdateBanks = [...startedValue.bank_informations].map((item) => {
        const tmpItme = item;
        if (
          !!tmpItme?.card_image?.url &&
          !!tmpItme?.card_image?.size &&
          !!tmpItme?.card_image?.type
        ) {
          return removeEmptyKey({
            ...tmpItme,
            bank_name: tmpItme.bank_name || '-',
          });
        }
        return removeEmptyKey({
          ...tmpItme,
          bank_name: tmpItme.bank_name || '-',
          card_image: {
            url: 'https://ui-avatars.com/api',
            size: 0,
            type: 'image/png',
          },
        });
      });
      newBankInformation = {
        ...newBankInformation,
        old_banks: tmpUpdateBanks?.filter((item: any) => !!item),
      };
    } else {
      newBankInformation = {
        ...newBankInformation,
        old_banks: [],
      };
    }

    if (profileState.updated_banks.length > 0) {
      const tmpNewUpdateBanks = profileState?.updated_banks?.map((item: any) => {
        const tmpItem: any = item;
        if (tmpItem?.card_image?.base64Data) {
          return {
            ...tmpItem,
            card_image: removeEmptyKey({
              ...tmpItem.card_image,
              url: undefined,
            }),
          };
        } else {
          return removeEmptyKey({
            ...tmpItem,
          });
        }
      });
      newBankInformation = {
        ...newBankInformation,
        updated_banks: profileState.updated_banks,
      };
    }

    if (profileState?.deleted_banks.length > 0) {
      const tmpDeletedBanks = profileState?.deleted_banks.map((item: BankInformation) => {
        const tmpItme: BankInformation = item;
        if (
          tmpItme &&
          !!tmpItme?.card_image?.url &&
          !!tmpItme?.card_image?.size &&
          !!tmpItme?.card_image?.type
        ) {
          return removeEmptyKey({
            ...tmpItme,
            bank_name: tmpItme.bank_name || '-',
          });
        }
        return removeEmptyKey({
          ...tmpItme,
          bank_name: tmpItme.bank_name || '-',
          card_image: {
            url: 'https://ui-avatars.com/api',
            size: 0,
            type: 'image/png',
          },
        });
      });
      newBankInformation = {
        ...newBankInformation,
        deleted_banks: tmpDeletedBanks?.filter((item: any) => !!item),
      };
    }
    if (profileState.created_banks.length > 0) {
      newBankInformation = {
        ...newBankInformation,
        created_banks: profileState.created_banks,
      };
    }
    // }
    // const updateBank = {
    //   ...newBankInformation,
    // };
    const tpmForm1 = {
      ...profileState.form1,
      authority_id:
        profileState.form1.client_field === 'main' ? profileState.form1.authority_id : undefined,
    };
    const tpmForm2 = {
      ...profileState.form2,
    };
    let payload: any = {
      ...tpmForm1,
      ...tpmForm2,
      ...profileState.form3,
      ...profileState.form4,
      ...newBankInformation,
    };
    if (payload?.license_file?.base64Data) {
      delete payload?.license_file?.url;
    }
    if (profileState.form3.board_ofdec_file && !profileState.form3.board_ofdec_file[0]) {
      payload = {
        ...payload,
        board_ofdec_file: [],
      };
    }
    const filteredObj = Object.fromEntries(Object.entries(payload).filter(([key, value]) => value));
    if (filteredObj.entity_mobile === startedValue.entity_mobile) {
      delete filteredObj.entity_mobile;
    }
    try {
      const url = 'tender/client/edit-request/create';
      const rest = await axiosInstance.post(
        `${url}`,
        {
          ...filteredObj,
        },
        {
          headers: { 'x-hasura-role': activeRole! },
        }
      );
      if (rest) {
        enqueueSnackbar(translate('pages.client.success'), {
          variant: 'success',
          preventDuplicate: true,
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
        });
        navigate('/client/my-profile');
        setLoadingButtonState(false);
      } else {
        setLoadingButtonState(false);
      }
    } catch (err) {
      setLoadingButtonState(false);
      const statusCode = (err && err.statusCode) || 0;
      const message = (err && err.message) || null;
      enqueueSnackbar(
        `${
          statusCode < 500 && message ? message : translate('pages.common.internal_server_error')
        }`,
        {
          variant: 'error',
          preventDuplicate: true,
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
        }
      );
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Stack direction="row">
        <Button
          color="inherit"
          variant="contained"
          onClick={() => navigate(-1)}
          sx={{ padding: 2, minWidth: 35, minHeight: 25, mr: 3 }}
        >
          <Iconify
            icon={
              currentLang.value === 'en'
                ? 'eva:arrow-ios-back-outline'
                : 'eva:arrow-ios-forward-outline'
            }
            width={25}
            height={25}
          />
        </Button>
      </Stack>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h4">تعديل بيانات الحساب</Typography>
        <LoadingButton
          disabled={Object.entries(isEdit).some(([key, value]) => value) ? false : true}
          loading={LoadingButtonState}
          onClick={onSubmitEditRequest}
          size="large"
          sx={{
            color: '#fff',
            backgroundColor: 'background.paper',
          }}
        >
          إرسال التعديلات
        </LoadingButton>
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
        {taps.map((label, index) => {
          const checkIndexBank =
            Object.values(editedTabs).findIndex((value) => value === label) === index;
          return (
            <Tab
              key={index}
              label={translate(label)}
              disabled={checkIndexBank ? true : !checkIndexBank && false}
              sx={{
                borderRadius: 0,
                px: 3,
                backgroundColor: checkIndexBank ? 'red' : '#E6E8EE',
                color: checkIndexBank ? theme.palette.primary.contrastText : 'main',
                '&.MuiTab-root:not(:last-of-type)': {
                  marginRight: 0,
                },
                '&.Mui-selected': {
                  backgroundColor: theme.palette.primary.main,
                  color: theme.palette.primary.contrastText,
                },
              }}
            />
          );
        })}
      </Tabs>
      {fetching && <>... Loading</>}
      {step === 0 && !fetching && (
        <Box sx={{ px: { xs: 0, sm: '100px' }, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Typography variant="h5">المعلومات الرئيسية</Typography>
          <MainForm onSubmit={onSubmit1} defaultValues={profileState.form1} isEdit={isEdit.form1}>
            <ActionsBox isEdit={isEdit.form1} />
          </MainForm>
        </Box>
      )}
      {step === 1 && (
        <Box sx={{ px: { xs: 0, sm: '100px' }, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Typography variant="h5">معلومات الاتصال</Typography>
          <ConnectingInfoForm
            onSubmit={onSubmit2}
            defaultValues={profileState.form2 as ConnectingValuesProps}
            isEdit={isEdit.form2}
          >
            <ActionsBox isEdit={isEdit.form2} />
          </ConnectingInfoForm>
        </Box>
      )}
      {step === 2 && (
        <Box sx={{ px: { xs: 0, sm: '100px' }, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Typography variant="h5">معلومات الترخيص</Typography>
          <LicenseInfoForm
            onSubmit={onSubmit3}
            defaultValues={profileState.form3}
            isEdit={isEdit.form3}
          >
            <ActionsBox isEdit={isEdit.form3} />
          </LicenseInfoForm>
        </Box>
      )}
      {step === 3 && (
        <Box sx={{ px: { xs: 0, sm: '100px' }, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Typography variant="h5">بيانات ادارية</Typography>
          <AdministrativeInfoForm
            onSubmit={onSubmit4}
            defaultValues={profileState.form4}
            isEdit={isEdit.form4}
          >
            <ActionsBox isEdit={isEdit.form4} />
          </AdministrativeInfoForm>
        </Box>
      )}
      {step === 4 && !fetching && (
        <Box sx={{ px: { xs: 0, sm: '100px' }, display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Typography variant="h5">معلومات بنكية</Typography>
          <BankingInfoForm
            onDelete={onDeleteBankInformation}
            onSubmit={onSubmit5}
            initialValue={profileState.form5}
            isEdit={isEdit.form5}
            updateBank={editedTabs.form5 ? true : false}
            numberOfUpdate={(editedTabs && editedTabs.numberOfUpdatedBanks) ?? 0}
          />
        </Box>
      )}
    </Box>
  );
}

export default ClientProfileEditForm;

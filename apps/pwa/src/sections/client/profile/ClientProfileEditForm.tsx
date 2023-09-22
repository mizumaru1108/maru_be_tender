import { LoadingButton } from '@mui/lab';
import { Box, IconButton, Stack, Tab, Tabs, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import { useSnackbar } from 'notistack';
import { gettingUserDataForEdit } from 'queries/client/gettingUserDataForEdit';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { useQuery } from 'urql';
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
  const { translate } = useLocales();
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
  const [errorState, setErrorState] = useState({
    value: false,
    message: '',
  });
  const [startedValue, setStartedValue] = useState<any>();
  const onSubmit = () => {
    setOpen(true);
    window.scrollTo(0, 0);
  };
  const handleTapChange = (event: React.SyntheticEvent, newValue: number) => {
    // set active tab
    setStep(newValue);

    // set is edit to be false
    // setIsEdit((prevIsEdit: any) => ({
    //   ...prevIsEdit,
    //   form1: false,
    //   form2: false,
    //   form3: false,
    //   form4: false,
    //   form5: false,
    // }));

    // set state to origin data every change tab
    // let defaultBoardofDec: FileProp[] = [];
    // defaultBoardofDec.push(
    //   ...(startedValue && startedValue.board_ofdec_file && startedValue.board_ofdec_file)
    // );
    // let defaultBank: BankingValuesProps[] = [];
    // defaultBank.push(
    //   ...(startedValue && startedValue.bank_informations && startedValue.bank_informations)
    // );
    // setProfileState((prevProfileState: any) => ({
    //   ...prevProfileState,
    //   form1: {
    //     // ...prevProfileState.form1,
    //     entity: startedValue && startedValue.entity && startedValue.entity,
    //     client_field: startedValue && startedValue.client_field && startedValue.client_field,
    //     client_field_id:
    //       startedValue && startedValue.client_field_id && startedValue.client_field_id,
    //     authority: startedValue && startedValue.authority && startedValue.authority,
    //     authority_id: startedValue && startedValue.authority_id && startedValue.authority_id,
    //     date_of_esthablistmen:
    //       startedValue && startedValue.date_of_esthablistmen && startedValue.date_of_esthablistmen,
    //     headquarters: startedValue && startedValue.headquarters && startedValue.headquarters,
    //     num_of_beneficiaries:
    //       startedValue && startedValue.num_of_beneficiaries && startedValue.num_of_beneficiaries,
    //     num_of_employed_facility:
    //       startedValue &&
    //       startedValue.num_of_employed_facility &&
    //       startedValue.num_of_employed_facility,
    //   },
    //   form2: {
    //     // ...prevProfileState.form2,
    //     region: startedValue && startedValue.region && startedValue.region,
    //     region_id: startedValue && startedValue.region_id && startedValue.region_id,
    //     governorate: startedValue && startedValue.governorate && startedValue.governorate,
    //     governorate_id: startedValue && startedValue.governorate_id && startedValue.governorate_id,
    //     center_administration:
    //       startedValue && startedValue.center_administration && startedValue.center_administration,
    //     entity_mobile: startedValue && startedValue.entity_mobile && startedValue.entity_mobile,
    //     phone: startedValue && startedValue.phone && startedValue.phone,
    //     twitter_acount: startedValue && startedValue.twitter_acount && startedValue.twitter_acount,
    //     website: startedValue && startedValue.website && startedValue.website,
    //     email: startedValue && startedValue.email && startedValue.email,
    //   },
    //   form3: {
    //     // ...prevProfileState.form3,
    //     license_number: startedValue && startedValue.license_number && startedValue.license_number,
    //     license_issue_date:
    //       startedValue && startedValue.license_issue_date && startedValue.license_issue_date,
    //     license_expired:
    //       startedValue && startedValue.license_expired && startedValue.license_expired,
    //     license_file: {
    //       ...(startedValue && startedValue.license_file && { ...startedValue.license_file }),
    //     },
    //     board_ofdec_file: defaultBoardofDec,
    //   },
    //   form4: {
    //     // ...prevProfileState.form4,
    //     ceo_name: startedValue && startedValue.ceo_name && startedValue.ceo_name,
    //     ceo_mobile: startedValue && startedValue.ceo_mobile && startedValue.ceo_mobile,
    //     data_entry_name:
    //       startedValue && startedValue.data_entry_name && startedValue.data_entry_name,
    //     data_entry_mobile:
    //       startedValue && startedValue.data_entry_mobile && startedValue.data_entry_mobile,
    //     data_entry_mail:
    //       startedValue && startedValue.data_entry_mail && startedValue.data_entry_mail,
    //     chairman_name: startedValue && startedValue.chairman_name && startedValue.chairman_name,
    //     chairman_mobile:
    //       startedValue && startedValue.chairman_mobile && startedValue.chairman_mobile,
    //   },
    //   form5: [...defaultBank],
    // }));
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
        chairman_name,
        chairman_mobile,
        //
        authority_detail,
        client_field_details,
      } = client;
      setStartedValue({ bank_informations, ...client });
      let newval: any = [];
      if (board_ofdec_file instanceof Array && board_ofdec_file.length > 0) {
        newval = [...board_ofdec_file];
      } else if (typeof board_ofdec_file === 'object') {
        newval.push(board_ofdec_file);
      }
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
            ...license_file,
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
      // revert state to origin data of active tab, before user can edit the data
      // setProfileState((prevProfileState: any) => ({
      //   ...prevProfileState,
      //   form1: {
      //     ...prevProfileState.form1,
      //     entity: startedValue && startedValue.entity && startedValue.entity,
      //     client_field: startedValue && startedValue.client_field && startedValue.client_field,
      //     authority: startedValue && startedValue.authority && startedValue.authority,
      //     authority_id: startedValue && startedValue.authority_id && startedValue.authority_id,
      //     date_of_esthablistmen:
      //       startedValue &&
      //       startedValue.date_of_esthablistmen &&
      //       startedValue.date_of_esthablistmen,
      //     headquarters: startedValue && startedValue.headquarters && startedValue.headquarters,
      //     num_of_beneficiaries:
      //       startedValue && startedValue.num_of_beneficiaries && startedValue.num_of_beneficiaries,
      //     num_of_employed_facility:
      //       startedValue &&
      //       startedValue.num_of_employed_facility &&
      //       startedValue.num_of_employed_facility,
      //   },
      // }));
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
    // console.log({ data });
    window.scrollTo(0, 0);
    if (isEdit && isEdit.form2) {
      setIsEdit((prevIsEdit: any) => ({
        ...prevIsEdit,
        form2: false,
      }));
      // revert state to origin data of active tab, before user can edit the data
      // setProfileState((prevProfileState: any) => ({
      //   ...prevProfileState,
      // form2: {
      //   ...prevProfileState.form2,
      //   region: startedValue && startedValue.region && startedValue.region,
      //   governorate: startedValue && startedValue.governorate && startedValue.governorate,
      //   center_administration:
      //     startedValue &&
      //     startedValue.center_administration &&
      //     startedValue.center_administration,
      //   entity_mobile: startedValue && startedValue.entity_mobile && startedValue.entity_mobile,
      //   phone: startedValue && startedValue.phone && startedValue.phone,
      //   twitter_acount:
      //     startedValue && startedValue.twitter_acount && startedValue.twitter_acount,
      //   website: startedValue && startedValue.website && startedValue.website,
      //   email: startedValue && startedValue.email && startedValue.email,
      //   // password: startedValue && startedValue.password && startedValue.password,
      // },
      // }));
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
          // ...prevProfileState.form2,
          ...data,
        },
      }));
    }
  };
  // console.log('test form 2', profileState.form2);

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
      // revert state to origin data of active tab, before user can edit the data
      // setProfileState((prevProfileState: any) => ({
      //   ...prevProfileState,
      // form3: {
      //   ...prevProfileState.form3,
      //   license_number:
      //     startedValue && startedValue.license_number && startedValue.license_number,
      //   license_issue_date:
      //     startedValue && startedValue.license_issue_date && startedValue.license_issue_date,
      //   license_expired:
      //     startedValue && startedValue.license_expired && startedValue.license_expired,
      //   license_file: {
      //     ...(startedValue && startedValue.license_file && { ...startedValue.license_file }),
      //   },
      //   board_ofdec_file: defaultBoardofDec,
      // },
      // }));
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
      // revert state to origin data of active tab, before user can edit the data
      // setProfileState((prevProfileState: any) => ({
      //   ...prevProfileState,
      // form4: {
      //   ...prevProfileState.form4,
      //   ceo_name: startedValue && startedValue.ceo_name && startedValue.ceo_name,
      //   ceo_mobile: startedValue && startedValue.ceo_mobile && startedValue.ceo_mobile,
      //   data_entry_name:
      //     startedValue && startedValue.data_entry_name && startedValue.data_entry_name,
      //   data_entry_mobile:
      //     startedValue && startedValue.data_entry_mobile && startedValue.data_entry_mobile,
      //   data_entry_mail:
      //     startedValue && startedValue.data_entry_mail && startedValue.data_entry_mail,
      //   chairman_name: startedValue && startedValue.chairman_name && startedValue.chairman_name,
      //   chairman_mobile:
      //     startedValue && startedValue.chairman_mobile && startedValue.chairman_mobile,
      // },
      // }));
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
    // console.log({ data });
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
      // revert state to origin data of active tab, before user can edit the data
      // setProfileState((prevProfileState: any) => ({
      //   ...prevProfileState,
      //   form5: [...defaultBank],
      // }));
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
          if (data?.created_banks?.length! > 0) {
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
      }
      // console.log({ mergeArray });
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
    // newBankInformation = {
    //   ...newBankInformation,
    //   old_banks: [...profileState.form5].map((item) => {
    //     const tmpItme = item;
    //     return {
    //       ...tmpItme,
    //       bank_name: tmpItme.bank_name || '-',
    //     };
    //   }),
    // };
    if (startedValue.bank_informations && startedValue.bank_informations.length > 0) {
      newBankInformation = {
        ...newBankInformation,
        old_banks: [...startedValue.bank_informations].map((item) => {
          const tmpItme = item;
          return {
            ...tmpItme,
            bank_name: tmpItme.bank_name || '-',
          };
        }),
      };
    } else {
      newBankInformation = {
        ...newBankInformation,
        old_banks: [],
      };
    }

    if (profileState.updated_banks.length > 0) {
      newBankInformation = {
        ...newBankInformation,
        updated_banks: profileState.updated_banks,
      };
    }
    if (profileState.deleted_banks.length > 0) {
      newBankInformation = {
        ...newBankInformation,
        deleted_banks: profileState.deleted_banks,
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
    // const tmpForm4 = {
    //   ...profileState.form4,
    // };
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
    // console.log({ payload });
    const filteredObj = Object.fromEntries(Object.entries(payload).filter(([key, value]) => value));
    if (filteredObj.entity_mobile === startedValue.entity_mobile) {
      delete filteredObj.entity_mobile;
    }
    // const newPayload = editedTabs.form5 ? updateBank : filteredObj;
    // console.log({ payload, tpmForm2, tmpForm4 });
    try {
      // const url = editedTabs.form5
      //   ? 'tender/client/edit-request/create'
      //   : 'tender/client/edit-request/create';
      const url = 'tender/client/edit-request/create';
      const rest = await axiosInstance.post(
        `${url}`,
        {
          // proposal_id: id,
          // ...newPayload,
          ...filteredObj,
        },
        {
          headers: { 'x-hasura-role': activeRole! },
        }
      );
      // console.log({ rest });
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
        // mutate();
        navigate('/client/my-profile');
        setLoadingButtonState(false);
      } else {
        setLoadingButtonState(false);
      }
    } catch (err) {
      setLoadingButtonState(false);
      // enqueueSnackbar(err.message, {
      //   variant: 'error',
      //   preventDuplicate: true,
      //   autoHideDuration: 3000,
      //   anchorOrigin: {
      //     vertical: 'bottom',
      //     horizontal: 'center',
      //   },
      // });
      // console.log(err);
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
    // console.log({ newBankInformation });
    // console.log({ profileState });
  };
  // console.log('profileState', profileState);
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
        <LoadingButton
          loading={LoadingButtonState}
          onClick={onSubmitEditRequest}
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
        setErrorState
        {taps.map((label, index) => {
          const checkIndexBank =
            Object.values(editedTabs).findIndex((value) => value === label) === index;
          // console.log('checkIndexBank', checkIndexBank);
          // console.log('label', label);
          // console.log('index', index);
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
        <Box sx={{ px: '100px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Typography variant="h5">المعلومات الرئيسية</Typography>
          <MainForm onSubmit={onSubmit1} defaultValues={profileState.form1} isEdit={isEdit.form1}>
            <ActionsBox isEdit={isEdit.form1} />
          </MainForm>
        </Box>
      )}
      {step === 1 && (
        <Box sx={{ px: '100px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Typography variant="h5">معلومات الاتصال</Typography>
          <ConnectingInfoForm
            onSubmit={onSubmit2}
            defaultValues={profileState.form2 as ConnectingValuesProps}
            isEdit={isEdit.form2}
          >
            {/* <ActionsBox /> */}
            <ActionsBox isEdit={isEdit.form2} />
          </ConnectingInfoForm>
        </Box>
      )}
      {step === 2 && (
        <Box sx={{ px: '100px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Typography variant="h5">معلومات الترخيص</Typography>
          <LicenseInfoForm
            onSubmit={onSubmit3}
            defaultValues={profileState.form3}
            isEdit={isEdit.form3}
          >
            {/* <ActionsBox /> */}
            <ActionsBox isEdit={isEdit.form3} />
          </LicenseInfoForm>
        </Box>
      )}
      {step === 3 && (
        <Box sx={{ px: '100px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Typography variant="h5">بيانات ادارية</Typography>
          <AdministrativeInfoForm
            onSubmit={onSubmit4}
            defaultValues={profileState.form4}
            isEdit={isEdit.form4}
          >
            {/* <ActionsBox /> */}
            <ActionsBox isEdit={isEdit.form4} />
          </AdministrativeInfoForm>
        </Box>
      )}
      {step === 4 && !fetching && (
        <Box sx={{ px: '100px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Typography variant="h5">معلومات بنكية</Typography>
          <BankingInfoForm
            onDelete={onDeleteBankInformation}
            onSubmit={onSubmit5}
            initialValue={profileState.form5}
            isEdit={isEdit.form5}
            updateBank={editedTabs.form5 ? true : false}
            numberOfUpdate={(editedTabs && editedTabs.numberOfUpdatedBanks) ?? 0}
          />
          {/* <ActionsBox /> */}
          {/* <ActionsBox isEdit={isEdit.form5} /> */}
          {/* </BankingInfoForm> */}
        </Box>
      )}
      {/* <Toast
        variant="outlined"
        // toastType="success"
        toastType={errorState.value ? 'error' : 'success'}
        // message="تم التأكد من المعلومات أنها صحيحة, لحفظ تعديلاتك الرجاء الضغط على إرسال التعديلات أعلاه"
        message={
          errorState.value
            ? errorState.message
            : 'تم التأكد من المعلومات أنها صحيحة, لحفظ تعديلاتك الرجاء الضغط على إرسال التعديلات أعلاه'
        }
        autoHideDuration={10000}
        isOpen={open}
        position="bottom-right"
        onClose={() => {
          setOpen(false);
        }}
      /> */}
    </Box>
  );
}

export default ClientProfileEditForm;

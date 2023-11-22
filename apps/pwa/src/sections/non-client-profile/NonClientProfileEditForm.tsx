import { Box, Button, Stack, Typography } from '@mui/material';
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import { gettingUseInfoForEditEmployee } from 'queries/client/gettingUserDataForEdit';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { useQuery } from 'urql';
import { UserInfoFormProps } from '../../@types/register';
import {
  setActiveConversationId,
  setConversation,
  setMessageGrouped,
} from '../../redux/slices/wschat';
import axiosInstance from '../../utils/axios';
import ActionsBoxUserEdit from '../client/profile/ActionsBoxUserEdit';
import UserInfoForm from '../client/profile/forms/UserInfoForm';
import { useSnackbar } from 'notistack';
import formatPhone from '../../utils/formatPhone';
import Iconify from 'components/Iconify';

function NonClientProfileEditForm() {
  const { user, activeRole, logout } = useAuth();
  const id = user?.id;
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { translate, currentLang } = useLocales();
  const [result] = useQuery({ query: gettingUseInfoForEditEmployee, variables: { id } });
  const { data } = result;
  const initialValue = {
    form1: {
      email: '',
      old_password: '',
      current_password: '',
      new_password: '',
      confirm_password: '',
      mobile_number: '',
      employee_name: '',
    },
  };
  const [profileState, setProfileState] = useState(initialValue);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorState, setErrorState] = useState({
    value: false,
    message: '',
  });

  const dispatch = useDispatch();

  useEffect(() => {
    if (data?.user_by_pk) {
      const { email, mobile_number, employee_name } = data?.user_by_pk;
      setProfileState((prevState: any) => ({
        ...prevState,
        form1: {
          ...prevState.form1,
          email,
          mobile_number,
          employee_name,
        },
      }));
    }
  }, [data]);

  const onSubmit1 = async (data: UserInfoFormProps) => {
    setLoading(true);
    window.scrollTo(0, 0);
    const tmpMobilePhone = formatPhone({ phone: data.mobile_number, prefix: '+966' });
    const tmpValues = {
      ...data,
      mobile_number: tmpMobilePhone,
    };
    try {
      const rest: any = await axiosInstance.patch(
        'tender-user/update-profile',
        { ...tmpValues },
        {
          headers: { 'x-hasura-role': activeRole! },
        }
      );
      console.log({ rest });
      if (rest.status >= 200 && rest.status < 300) {
        setOpen(true);
        // timeout
        enqueueSnackbar(translate('pages.client.success'), {
          variant: 'success',
          preventDuplicate: true,
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
        });
        setErrorState({
          value: false,
          message: '',
        });
        setTimeout(() => {
          dispatch(setActiveConversationId(null));
          dispatch(setConversation([]));
          dispatch(setMessageGrouped([]));
          logout();
          navigate('/auth/login');
        }, 500);
      }
    } catch (err) {
      setLoading(false);
      setOpen(true);
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
      setErrorState({
        value: true,
        message: err.message,
      });
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
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
        <Typography variant="h4">تحرير معلومات المستخدم</Typography>
      </Stack>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Typography variant="h5">المعلومات الرئيسية</Typography>
        <UserInfoForm onSubmit={onSubmit1} defaultValues={profileState.form1}>
          <ActionsBoxUserEdit loading={loading} />
        </UserInfoForm>
      </Box>
    </Box>
  );
}

export default NonClientProfileEditForm;

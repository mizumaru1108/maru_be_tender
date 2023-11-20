import { Box, Button, Stack, Typography } from '@mui/material';
import Toast from 'components/toast';
import useAuth from 'hooks/useAuth';
import useLocales from 'hooks/useLocales';
import { gettingUseInfoForEdit } from 'queries/client/gettingUserDataForEdit';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { useQuery } from 'urql';
import { UserInfoFormProps } from '../../../@types/register';
import {
  setActiveConversationId,
  setConversation,
  setMessageGrouped,
} from '../../../redux/slices/wschat';
import axiosInstance from '../../../utils/axios';
import ActionsBoxUserEdit from './ActionsBoxUserEdit';
import UserInfoForm from './forms/UserInfoForm';
import Iconify from 'components/Iconify';
function ClientProfileEditForm() {
  const { user, activeRole, logout } = useAuth();
  const id = user?.id;
  const navigate = useNavigate();
  const { currentLang } = useLocales();
  const [result] = useQuery({ query: gettingUseInfoForEdit, variables: { id } });
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
      const { email } = data?.user_by_pk;
      setProfileState((prevState: any) => ({
        ...prevState,
        form1: {
          ...prevState.form1,
          email,
        },
      }));
    }
  }, [data]);

  const onSubmit1 = async (data: UserInfoFormProps) => {
    setLoading(true);
    window.scrollTo(0, 0);
    try {
      const rest: any = await axiosInstance.patch(
        'tender-user/update-profile',
        { ...data },
        {
          headers: { 'x-hasura-role': activeRole! },
        }
      );
      if (rest.status >= 200 && rest.status < 300) {
        setOpen(true);
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
      setErrorState({
        value: true,
        message: err.message,
      });
      console.log({ err });
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
      <Toast
        variant="outlined"
        toastType={errorState.value ? 'error' : 'success'}
        message={
          errorState.value
            ? errorState.message
            : 'تم بنجاح تغيير معلومات المستخدم ، وإعادة التوجيه لتسجيل الدخول ...'
        }
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

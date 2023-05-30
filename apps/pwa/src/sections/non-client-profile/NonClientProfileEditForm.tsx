import { Box, IconButton, Stack, Typography } from '@mui/material';
import Toast from 'components/toast';
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

function NonClientProfileEditForm() {
  const { user, activeRole, logout } = useAuth();
  const id = user?.id;
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { translate } = useLocales();
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
      console.log('data:', data?.user_by_pk);
      setProfileState((prevState: any) => ({
        ...prevState,
        form1: {
          ...prevState.form1,
          email,
          mobile_number,
          employee_name,
          // current_password: password,
        },
      }));
    }
  }, [data]);

  const onSubmit1 = async (data: UserInfoFormProps) => {
    setLoading(true);
    window.scrollTo(0, 0);
    console.log(data);
    try {
      const rest: any = await axiosInstance.patch(
        'tender-user/update-profile',
        { ...data },
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
      // enqueueSnackbar(err.message, {
      //   variant: 'error',
      //   preventDuplicate: true,
      //   autoHideDuration: 3000,
      //   anchorOrigin: {
      //     vertical: 'bottom',
      //     horizontal: 'center',
      //   },
      // });
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
      // console.log({ err });
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Stack direction="row">
        <IconButton
          onClick={() => {
            navigate(-1);
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
        <Typography variant="h4">تحرير معلومات المستخدم</Typography>
      </Stack>
      <Box sx={{ px: '100px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Typography variant="h5">المعلومات الرئيسية</Typography>
        <UserInfoForm onSubmit={onSubmit1} defaultValues={profileState.form1}>
          <ActionsBoxUserEdit loading={loading} />
        </UserInfoForm>
      </Box>
      {/* <Toast
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
      /> */}
    </Box>
  );
}

export default NonClientProfileEditForm;

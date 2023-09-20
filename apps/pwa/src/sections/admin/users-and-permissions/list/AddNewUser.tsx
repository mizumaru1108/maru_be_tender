import {
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import BaseField from 'components/hook-form/BaseField';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate, useParams } from 'react-router';
import * as Yup from 'yup';
import { FormProvider, RHFSelect } from 'components/hook-form';
import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import useAuth from 'hooks/useAuth';
import axiosInstance from 'utils/axios';
import { LoadingButton } from '@mui/lab';
import { PERMISSIONS } from '_mock/permissions';
import { translateRect } from '@fullcalendar/common';
import useLocales from 'hooks/useLocales';
import { getOneEmployee } from '../../../../queries/admin/getAllTheEmployees';
import { useQuery } from 'urql';
import { removeEmptyKey } from '../../../../utils/remove-empty-key';
import { TrackProps } from '../../../../@types/commons';
import { useSnackbar } from 'notistack';
import formatPhone from 'utils/formatPhone';

type FormValuesProps = {
  employee_name: string;
  email: string;
  mobile_number: string;
  password: string;
  user_roles: string[];
  employee_path?: string;
  track_id: string;
  activate_user: boolean;
};

interface SnackBar {
  open: boolean;
  message: string;
  severity: 'success' | 'error';
}

interface tracks {
  id: string;
  name: string;
  with_consultant?: boolean;
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function AddNewUser() {
  const { translate, currentLang } = useLocales();
  const navigate = useNavigate();
  const params = useParams();

  const [result] = useQuery({
    query: getOneEmployee,
    variables: { id: params.userId },
  });
  const { data, fetching, error } = result;

  const { activeRole } = useAuth();

  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [tracksData, setTracksData] = React.useState<TrackProps[]>([]);

  const [openSnackBar, setOpenSnackBar] = React.useState<SnackBar>({
    open: false,
    message: '',
    severity: 'success',
  });
  const reqPassword = Yup.string().required('password is required');
  const unReqPassword = Yup.string()
    .notRequired()
    .nullable()
    // .test('len', translate('password at least 8 characters'), (val) => {
    //   const isLength = val?.length === 8;
    //   return isLength;
    // });
    .test('len', translate('password at least 8 characters'), (val) => {
      if (val === undefined) {
        return true;
      } else {
        return val!.length === 0 || val!.length > 7;
      }
    });
  // .min(8, 'password must be at least 8 characters');
  // .test
  const NewEmployeeSchema = Yup.object().shape({
    employee_name: Yup.string().required('Employee Name required'),
    email: Yup.string().required('Email is required'),
    mobile_number: Yup.string()
      .required(translate('errors.register.entity_mobile.required'))
      .test('len', translate('errors.register.entity_mobile.length'), (val) => {
        if (val === undefined) {
          return true;
        }

        return val.length === 0 || val!.length === 9;
      }),
    password: !params.userId ? reqPassword : unReqPassword,
    user_roles: Yup.array().required('User Roles is required'),
    employee_path: Yup.string().required('Employee Path is required'),
    activate_user: Yup.boolean().required('Activate User is required'),
  });

  const defaultValues = {
    employee_name: '',
    email: '',
    mobile_number: '',
    password: '',
    user_roles: [],
    employee_path: '',
    activate_user: false,
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewEmployeeSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    // console.log({ data });
    // console.log('submit: ', data);
    const tmpMobile = formatPhone({ phone: data.mobile_number, prefix: '+966' });
    let payload = {
      ...data,
      mobile_number: tmpMobile,
    };
    payload.track_id = (data && data.employee_path) ?? '';
    delete payload.employee_path;
    // console.log({ payload });
    try {
      setIsLoading(true);
      await axiosInstance.post(
        '/tender-user/create',
        {
          ...payload,
        },
        { headers: { 'x-hasura-role': activeRole! } }
      );
      setIsLoading(false);
      setOpenSnackBar({ open: true, message: 'تم إنشاء الحساب', severity: 'success' });
      navigate('/admin/dashboard/users-and-permissions');
    } catch (error) {
      let message: string | undefined = undefined;
      if ((error?.statusCode && error?.statusCode === 409) || error?.error === 'conflict') {
        message = translate('snackbar.admin.duplicate_mobile_number');
      }
      setIsLoading(false);
      setOpenSnackBar({ open: true, message: message || error?.message, severity: 'error' });
    }
  };

  const onUpdate = async (data: FormValuesProps) => {
    const tmpMobile = formatPhone({ phone: data.mobile_number, prefix: '+966' });
    let payload = {
      ...data,
      id: params.userId,
    };
    payload.track_id = (data && data.employee_path) ?? '';
    delete payload.employee_path;
    payload.mobile_number = tmpMobile;
    payload = removeEmptyKey(payload);
    // console.log('update: ', payload);
    // alert('under construction');
    try {
      setIsLoading(true);
      await axiosInstance.patch(
        'tender-user/update-user',
        {
          ...payload,
        },
        { headers: { 'x-hasura-role': activeRole! } }
      );
      setIsLoading(false);
      setOpenSnackBar({ open: true, message: 'تم إنشاء الحساب', severity: 'success' });
      navigate('/admin/dashboard/users-and-permissions');
    } catch (error) {
      let message: string | undefined = undefined;
      if ((error?.statusCode && error?.statusCode === 409) || error?.error === 'conflict') {
        message = translate('snackbar.admin.duplicate_mobile_number');
      }
      setIsLoading(false);
      setOpenSnackBar({ open: true, message: message || error?.message, severity: 'error' });
    }
  };

  const handleCloseSnackBar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackBar({ open: false, message: '', severity: 'success' });
  };

  const fetchingTracks = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const rest = await axiosInstance.get(`/tender/track?include_general=1`, {
        headers: { 'x-hasura-role': activeRole! },
      });
      // console.log(rest.data.data);
      if (rest) {
        setTracksData(
          rest.data.data.map((item: tracks) => ({
            id: item.id ?? '-',
            name: item.name ?? 'No Record',
            with_consultant: item.with_consultant ?? 'No Record',
          }))
        );
      }
      // console.log('rest', rest.data.data);
    } catch (err) {
      // console.log('err', err);
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
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeRole, enqueueSnackbar]);

  React.useEffect(() => {
    fetchingTracks();
  }, [fetchingTracks]);

  React.useEffect(() => {
    if (params.userId) {
      if (!fetching && !error && data && tracksData) {
        // console.log({ data });
        // console.log('test : ', tracksData.find((item) => item.id === data.data.track_id)?.id);
        const userRole: string[] =
          data.data.user_role.length > 0 ? data.data.user_role.map((role: any) => role.role) : [];
        const tmpMobileNumber =
          data.data.mobile_number.substring(0, 3) === '+62'
            ? data.data.mobile_number.replace('+62', '')
            : data.data.mobile_number.replace('+966', '');
        // console.log({ tmpMobileNumber });
        const tmpActiveUser = data?.data?.status_id === 'ACTIVE_ACCOUNT' ? true : false;
        reset({
          activate_user: tmpActiveUser,
          email: data.data.email,
          password: '',
          employee_name: data.data.employee_name,
          // employee_path: data.data.employee_path ?? 'GENERAL',
          employee_path: tracksData.find((item) => item.id === data.data.track_id)?.id ?? '',
          mobile_number: tmpMobileNumber,
          user_roles: [...userRole],
        });
      }
    }
  }, [params, fetching, error, data, reset, tracksData]);
  if (isLoading) return <>Loading...</>;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Snackbar
        open={openSnackBar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackBar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackBar}
          severity={openSnackBar.severity}
          sx={{ width: '100%' }}
        >
          {openSnackBar.message}
        </Alert>
      </Snackbar>
      <IconButton
        onClick={() => {
          navigate('/admin/dashboard/users-and-permissions');
        }}
        sx={{ alignSelf: 'baseline' }}
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
            fillOpacity="0.24"
          />
          <path
            d="M16.0068 12.341C16.0057 12.5165 16.0394 12.6904 16.1057 12.8529C16.1721 13.0153 16.2698 13.1631 16.3934 13.2877L22.5134 19.3944C22.6384 19.5183 22.7376 19.6658 22.8053 19.8283C22.873 19.9907 22.9078 20.165 22.9078 20.341C22.9078 20.517 22.873 20.6913 22.8053 20.8538C22.7376 21.0163 22.6384 21.1637 22.5134 21.2877L16.3934 27.3944C16.1423 27.6454 16.0013 27.986 16.0013 28.341C16.0013 28.6961 16.1423 29.0366 16.3934 29.2877C16.6445 29.5388 16.985 29.6798 17.3401 29.6798C17.5159 29.6798 17.69 29.6452 17.8524 29.5779C18.0148 29.5106 18.1624 29.412 18.2868 29.2877L24.3934 23.1677C25.1235 22.4078 25.5312 21.3948 25.5312 20.341C25.5312 19.2872 25.1235 18.2743 24.3934 17.5144L18.2868 11.3944C18.1628 11.2694 18.0153 11.1702 17.8529 11.1025C17.6904 11.0348 17.5161 11 17.3401 11C17.1641 11 16.9898 11.0348 16.8273 11.1025C16.6648 11.1702 16.5174 11.2694 16.3934 11.3944C16.2698 11.5189 16.1721 11.6667 16.1057 11.8291C16.0394 11.9916 16.0057 12.1655 16.0068 12.341Z"
            fill="#1E1E1E"
          />
        </svg>
      </IconButton>
      <Typography variant="h4">اضافة موظف جديد</Typography>
      <Container>
        <FormProvider
          methods={methods}
          onSubmit={handleSubmit(!params.userId ? onSubmit : onUpdate)}
        >
          <Grid container rowSpacing={3} columnSpacing={4}>
            <Grid item md={6} xs={12}>
              <BaseField
                type="textField"
                name="employee_name"
                label="اسم الموظف*"
                placeholder="الرجاء كتابة اسم الموظف"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <BaseField
                type="textField"
                name="email"
                label="البريد الإلكتروني*"
                placeholder="الرجاء كتابة البريد الإلكتروني"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <BaseField
                type="password"
                name="password"
                label="كلمة المرور*"
                // placeholder="الرجاء كتابة كلمة المرور"
                placeholder={
                  params.userId ? 'اكتب كلمة مرور جديدة لتغييرها' : 'الرجاء كتابة كلمة المرور'
                }
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <BaseField
                type="textField"
                name="mobile_number"
                // label="*رقم الجوال"
                label={currentLang.value === 'ar' ? '*رقم الجوال' : 'رقم الجوال*'}
                placeholder="الرجاء كتابة رقم الجوال"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              {/* <BaseField
                type="select"
                name="employee_path"
                label="مسار للموظف*"
                placeholder="الرجاء اختيار اسم الجهة"
              >
                <>
                  <option value={'GENERAL'} style={{ backgroundColor: '#fff' }}>
                    عام
                  </option>
                  <option value={'MOSQUES'} style={{ backgroundColor: '#fff' }}>
                    مسار المساجد
                  </option>
                  <option value={'CONCESSIONAL_GRANTS'} style={{ backgroundColor: '#fff' }}>
                    مسار المنح الميسر
                  </option>
                  <option value={'INITIATIVES'} style={{ backgroundColor: '#fff' }}>
                    مسار المبادرات
                  </option>
                  <option value={'BAPTISMS'} style={{ backgroundColor: '#fff' }}>
                    مسار التعميدات
                  </option>
                </>
              </BaseField> */}
              <RHFSelect
                type="select"
                name="employee_path"
                label="مسار للموظف*"
                placeholder="الرجاء اختيار اسم الجهة"
                disabled={isLoading}
                size="small"
              >
                {tracksData?.map((item: tracks, index: any) => (
                  <MenuItem key={index} value={item?.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </RHFSelect>
            </Grid>
            <Grid item md={6} xs={12}>
              <BaseField
                type="checkbox"
                name="activate_user"
                label="الحساب نشط"
                placeholder="الحساب نشط"
              />
            </Grid>
            <Grid item md={12} xs={12}>
              <BaseField
                type="checkboxMulti"
                name="user_roles"
                label="صلاحيات الموظف*"
                placeholder="صلاحيات الموظف"
                options={PERMISSIONS.map((item, index) => ({
                  label: translate(`permissions.${item}`),
                  value: item,
                }))}
              />
            </Grid>
            <Grid item md={12} xs={12}>
              <Stack direction="row" justifyContent="center">
                <Box
                  sx={{
                    borderRadius: 2,
                    height: '90px',
                    backgroundColor: '#fff',
                    padding: '24px',
                  }}
                >
                  <Stack justifyContent="center" direction="row" gap={3}>
                    <Button
                      onClick={() => {
                        console.log('asdklasdlkasd');
                      }}
                      sx={{
                        color: 'text.primary',
                        width: { xs: '100%', sm: '200px' },
                        hieght: { xs: '100%', sm: '50px' },
                      }}
                    >
                      رجوع
                    </Button>
                    <Box sx={{ width: '10px' }} />
                    <LoadingButton
                      type="submit"
                      variant="outlined"
                      sx={{
                        backgroundColor: 'background.paper',
                        color: '#fff',
                        width: { xs: '100%', sm: '200px' },
                        hieght: { xs: '100%', sm: '50px' },
                        '&:hover': { backgroundColor: '#0E8478' },
                      }}
                      loading={isLoading}
                    >
                      إنشاء
                    </LoadingButton>
                  </Stack>
                </Box>
              </Stack>
            </Grid>
          </Grid>
        </FormProvider>
      </Container>
    </Box>
  );
}

export default AddNewUser;

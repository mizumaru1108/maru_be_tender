import { Box, Button, Container, Grid, IconButton, Stack, Typography } from '@mui/material';
import BaseField from 'components/hook-form/BaseField';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router';
import * as Yup from 'yup';
import { FormProvider } from 'components/hook-form';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { TMRA_RAISE_URL } from 'config';

type FormValuesProps = {
  employee_name: string;
  email: string;
  mobile_number: string;
  password: string;
  user_roles: string;
  employee_path: string;
  activate_user: boolean;
};

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function AddNewUser() {
  const [errorOpen, setErrorOpen] = React.useState(false);

  const [error, setError] = React.useState<string>('');

  const [sucessCreateOpen, setSucessCreateOpen] = React.useState(false);

  const NewEmployeeSchema = Yup.object().shape({
    employee_name: Yup.string().required('Employee Name required'),
    email: Yup.string().required('Email is required'),
    mobile_number: Yup.string()
      .required('Mobile Number is required')
      .matches(
        /^\+9665[0-9]{8}$/,
        `The Mobile Number must be written in the exact way of +9665xxxxxxxx`
      ),
    password: Yup.string().required('password is required'),
    user_roles: Yup.string().required('User Roles is required'),
    employee_path: Yup.string().required('Employee Path is required'),
    activate_user: Yup.boolean().required('Activate User is required'),
  });

  const defaultValues = {
    employee_name: '',
    email: '',
    mobile_number: '',
    password: '',
    user_roles: '',
    employee_path: '',
    activate_user: false,
  };

  const methods = useForm<FormValuesProps>({
    resolver: yupResolver(NewEmployeeSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data: FormValuesProps) => {
    const { employee_path, ...restData } = data;
    try {
      const res = await axios.post(
        `${TMRA_RAISE_URL}/tender-employee/create`,
        { ...restData, ...(data.employee_path !== 'GENERAL' && { employee_path }) },
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );
      setSucessCreateOpen(true);
      navigate('/admin/dashboard/users-and-permissions');
    } catch (error) {
      setError(error.response.data.message);
      setErrorOpen(true);
    }
  };

  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSucessCreateOpen(false);
    setErrorOpen(false);
  };

  const navigate = useNavigate();
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Snackbar
        open={sucessCreateOpen}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          تم إنشاء الحساب بنجاح
        </Alert>
      </Snackbar>

      <Snackbar
        open={errorOpen}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
          {error}
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
            fill-opacity="0.24"
          />
          <path
            d="M16.0068 12.341C16.0057 12.5165 16.0394 12.6904 16.1057 12.8529C16.1721 13.0153 16.2698 13.1631 16.3934 13.2877L22.5134 19.3944C22.6384 19.5183 22.7376 19.6658 22.8053 19.8283C22.873 19.9907 22.9078 20.165 22.9078 20.341C22.9078 20.517 22.873 20.6913 22.8053 20.8538C22.7376 21.0163 22.6384 21.1637 22.5134 21.2877L16.3934 27.3944C16.1423 27.6454 16.0013 27.986 16.0013 28.341C16.0013 28.6961 16.1423 29.0366 16.3934 29.2877C16.6445 29.5388 16.985 29.6798 17.3401 29.6798C17.5159 29.6798 17.69 29.6452 17.8524 29.5779C18.0148 29.5106 18.1624 29.412 18.2868 29.2877L24.3934 23.1677C25.1235 22.4078 25.5312 21.3948 25.5312 20.341C25.5312 19.2872 25.1235 18.2743 24.3934 17.5144L18.2868 11.3944C18.1628 11.2694 18.0153 11.1702 17.8529 11.1025C17.6904 11.0348 17.5161 11 17.3401 11C17.1641 11 16.9898 11.0348 16.8273 11.1025C16.6648 11.1702 16.5174 11.2694 16.3934 11.3944C16.2698 11.5189 16.1721 11.6667 16.1057 11.8291C16.0394 11.9916 16.0057 12.1655 16.0068 12.341Z"
            fill="#1E1E1E"
          />
        </svg>
      </IconButton>
      <Typography variant="h4">اضافة موظف جديد</Typography>
      <Container>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Grid container rowSpacing={3} columnSpacing={4}>
            <Grid item md={6} xs={12}>
              <BaseField
                type="textField"
                name="employee_name"
                label="اسم الموظف"
                placeholder="الرجاء كتابة اسم الموظف"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <BaseField
                type="textField"
                name="email"
                label="البريد الإلكتروني"
                placeholder="الرجاء كتابة البريد الإلكتروني"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <BaseField
                type="password"
                name="password"
                label="كلمة المرور"
                placeholder="الرجاء كتابة كلمة المرور"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <BaseField
                type="textField"
                name="mobile_number"
                label="رقم الجوال"
                placeholder="الرجاء كتابة رقم الجوال"
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <BaseField
                type="select"
                name="employee_path"
                label="مسار للموظف"
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
              </BaseField>
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
                type="radioGroup"
                name="user_roles"
                label="صلاحيات الموظف"
                placeholder="صلاحيات الموظف"
                options={[
                  { label: 'الرئيس', value: 'CEO' },
                  { label: 'مدير إدارة', value: 'PROJECT_MANAGER' },
                  { label: 'مشرف المشاريع', value: 'PROJECT_SUPERVISOR' },
                  { label: 'لجنة المستشارين', value: 'CONSULTANT' },
                  { label: 'محاسب', value: 'FINANCE' },
                  { label: 'أمين صندوق', value: 'CASHIER' },
                  { label: 'مسؤول الفرز', value: 'MODERATOR' },
                  { label: 'إدارة الشركاء (مشرف الحسابات)', value: 'ACCOUNTS_MANAGER' },
                  { label: 'سوبر ادمن', value: 'ADMIN' },
                ]}
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
                    <Button
                      type="submit"
                      variant="outlined"
                      sx={{
                        backgroundColor: 'background.paper',
                        color: '#fff',
                        width: { xs: '100%', sm: '200px' },
                        hieght: { xs: '100%', sm: '50px' },
                        '&:hover': { backgroundColor: '#0E8478' },
                      }}
                    >
                      إنشاء
                    </Button>
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

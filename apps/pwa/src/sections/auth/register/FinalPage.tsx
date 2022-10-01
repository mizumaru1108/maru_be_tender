import { Stack, Typography, Container, IconButton, Button } from '@mui/material';
import { createClient } from 'queries/auth/createClient';
import { useMutation } from 'urql';
import { AccountValuesProps } from '../../shared/types';
import { nanoid } from 'nanoid';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import axios from 'axios';
import { useState } from 'react';
import * as React from 'react';
import useAuth from 'hooks/useAuth';
import { LoadingButton } from '@mui/lab';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function FinalPage({ ...props }: AccountValuesProps) {
  const { login } = useAuth();
  const [id, setId] = useState('');
  const [open, setOpen] = useState(false);
  const [_, updateTodo] = useMutation(createClient);
  const [errors, setErrors] = useState('');
  const [isSending, setIsSending] = useState(false);
  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
  const hanelSubmit = async () => {
    setIsSending(true);
    const {
      bank_account_name,
      bank_account_number,
      bank_name,
      card_image,
      agree_on,
      ...client_data
    } = props;
    try {
      const { data } = await axios.post(
        'https://api-staging.tmra.io/v2/raise/auth/fusion/regTender',
        {
          data: [
            {
              id: nanoid(),
              employee_name: props.email,
              employee_path: props.email,
              bank_informations: [
                {
                  bank_account_name,
                  bank_account_number,
                  bank_name,
                  card_image,
                },
              ],
              status: 'WAITING_FOR_ACTIVATION',
              ...client_data,
            },
          ],
          roles: ['tender_client'],
        }
      );
      await login(props.email, props.password);
    } catch (error) {
      setErrors(error.message);
      setOpen(true);
      setIsSending(false);
    }
  };

  return (
    <Container sx={{ py: '20px' }}>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity="error">{errors}</Alert>
      </Snackbar>
      <Stack direction="column" gap={4}>
        <Typography variant="h4">إنشاء حساب جديد - التفاصيل كاملة</Typography>
        <Stack direction="column" gap={2}>
          <Stack direction="row" justifyContent="space-between">
            <Typography color="#93A3B0" sx={{ fontSize: '18px', fontWeight: 700 }}>
              المعلومات الرئيسية
            </Typography>
            <IconButton
              sx={{
                backgroundColor: '#0169DE',
                borderRadius: '10px !important',
                '&:hover': { backgroundColor: '#1482FE' },
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_594_5260)">
                  <path
                    d="M15.2353 0.765364C14.7821 0.312828 14.1678 0.0586548 13.5273 0.0586548C12.8869 0.0586548 12.2726 0.312828 11.8193 0.765364L0.976677 11.608C0.666178 11.9168 0.419985 12.284 0.252342 12.6886C0.0846994 13.0931 -0.00106532 13.5268 9.98748e-06 13.9647V15.3334C9.98748e-06 15.5102 0.0702479 15.6797 0.195272 15.8048C0.320296 15.9298 0.489866 16 0.666677 16H2.03534C2.47319 16.0013 2.90692 15.9156 3.31145 15.7481C3.71597 15.5806 4.08325 15.3345 4.39201 15.024L15.2353 4.1807C15.6877 3.72749 15.9417 3.11334 15.9417 2.47303C15.9417 1.83272 15.6877 1.21857 15.2353 0.765364ZM3.44934 14.0814C3.07335 14.4549 2.56532 14.6652 2.03534 14.6667H1.33334V13.9647C1.33267 13.702 1.38411 13.4417 1.4847 13.199C1.58529 12.9563 1.73302 12.7359 1.91934 12.5507L10.148 4.32203L11.6813 5.85536L3.44934 14.0814ZM14.292 3.23803L12.6213 4.90936L11.088 3.37936L12.7593 1.70803C12.86 1.60757 12.9795 1.52792 13.111 1.47364C13.2424 1.41935 13.3833 1.39149 13.5255 1.39164C13.6678 1.3918 13.8086 1.41997 13.9399 1.47454C14.0712 1.52911 14.1905 1.60902 14.291 1.7097C14.3915 1.81038 14.4711 1.92986 14.5254 2.06132C14.5797 2.19278 14.6076 2.33365 14.6074 2.47588C14.6072 2.6181 14.5791 2.75891 14.5245 2.89025C14.4699 3.02159 14.39 3.1409 14.2893 3.24136L14.292 3.23803Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_594_5260">
                    <rect width="16" height="16" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </IconButton>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Stack direction="column" flex={1}>
              <Typography sx={{ color: '#93A3B0', fontSize: '15px' }}>مجال الجهة:</Typography>
              <Typography sx={{ fontSize: '18px' }}>{props.entity}</Typography>
            </Stack>
            <Stack direction="column" flex={1}>
              <Typography sx={{ color: '#93A3B0', fontSize: '15px' }}>الجهة المشرفة:</Typography>
              <Typography sx={{ fontSize: '18px' }}>{props.authority}</Typography>
            </Stack>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Stack direction="column" flex={1}>
              <Typography sx={{ color: '#93A3B0', fontSize: '15px' }}>تاريخ التأسيس:</Typography>
              <Typography sx={{ fontSize: '20px' }}>
                {props.date_of_esthablistmen.toString()}
              </Typography>
            </Stack>
            <Stack direction="column" flex={1}>
              <Typography sx={{ color: '#93A3B0', fontSize: '15px' }}>المقر:</Typography>
              <Typography sx={{ fontSize: '18px' }}>{props.headquarters}</Typography>
            </Stack>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Stack direction="column" flex={1}>
              <Typography sx={{ color: '#93A3B0', fontSize: '15px' }}>
                عدد موظفين بدوام كلي للمنشأة:
              </Typography>
              <Typography sx={{ fontSize: '18px' }}>{props.num_of_employed_facility}</Typography>
            </Stack>
            <Stack direction="column" flex={1}>
              <Typography sx={{ color: '#93A3B0', fontSize: '15px' }}>
                عدد المستفيدين من خدمات الجهة:
              </Typography>
              <Typography sx={{ fontSize: '18px' }}>{props.num_of_beneficiaries}</Typography>
            </Stack>
          </Stack>
        </Stack>
        <Stack direction="column" gap={2}>
          <Stack direction="row" justifyContent="space-between">
            <Typography color="#93A3B0" sx={{ fontSize: '18px', fontWeight: 700 }}>
              معلومات الاتصال
            </Typography>
            <IconButton
              sx={{
                backgroundColor: '#0169DE',
                borderRadius: '10px !important',
                '&:hover': { backgroundColor: '#1482FE' },
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_594_5260)">
                  <path
                    d="M15.2353 0.765364C14.7821 0.312828 14.1678 0.0586548 13.5273 0.0586548C12.8869 0.0586548 12.2726 0.312828 11.8193 0.765364L0.976677 11.608C0.666178 11.9168 0.419985 12.284 0.252342 12.6886C0.0846994 13.0931 -0.00106532 13.5268 9.98748e-06 13.9647V15.3334C9.98748e-06 15.5102 0.0702479 15.6797 0.195272 15.8048C0.320296 15.9298 0.489866 16 0.666677 16H2.03534C2.47319 16.0013 2.90692 15.9156 3.31145 15.7481C3.71597 15.5806 4.08325 15.3345 4.39201 15.024L15.2353 4.1807C15.6877 3.72749 15.9417 3.11334 15.9417 2.47303C15.9417 1.83272 15.6877 1.21857 15.2353 0.765364ZM3.44934 14.0814C3.07335 14.4549 2.56532 14.6652 2.03534 14.6667H1.33334V13.9647C1.33267 13.702 1.38411 13.4417 1.4847 13.199C1.58529 12.9563 1.73302 12.7359 1.91934 12.5507L10.148 4.32203L11.6813 5.85536L3.44934 14.0814ZM14.292 3.23803L12.6213 4.90936L11.088 3.37936L12.7593 1.70803C12.86 1.60757 12.9795 1.52792 13.111 1.47364C13.2424 1.41935 13.3833 1.39149 13.5255 1.39164C13.6678 1.3918 13.8086 1.41997 13.9399 1.47454C14.0712 1.52911 14.1905 1.60902 14.291 1.7097C14.3915 1.81038 14.4711 1.92986 14.5254 2.06132C14.5797 2.19278 14.6076 2.33365 14.6074 2.47588C14.6072 2.6181 14.5791 2.75891 14.5245 2.89025C14.4699 3.02159 14.39 3.1409 14.2893 3.24136L14.292 3.23803Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_594_5260">
                    <rect width="16" height="16" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </IconButton>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Stack direction="column" flex={1}>
              <Typography sx={{ color: '#93A3B0', fontSize: '15px' }}>المنطقة:</Typography>
              <Typography sx={{ fontSize: '18px' }}>{props.region}</Typography>
            </Stack>
            <Stack direction="column" flex={1}>
              <Typography sx={{ color: '#93A3B0', fontSize: '15px' }}>المحافظة:</Typography>
              <Typography sx={{ fontSize: '18px' }}>{props.governorate}</Typography>
            </Stack>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Stack direction="column" flex={1}>
              <Typography sx={{ color: '#93A3B0', fontSize: '15px' }}>المركز (الإدارة):</Typography>
              <Typography sx={{ fontSize: '18px' }}>{props.center_administration}</Typography>
            </Stack>
            <Stack direction="column" flex={1}>
              <Typography sx={{ color: '#93A3B0', fontSize: '15px' }}>جوال الجهة:</Typography>
              <Typography sx={{ fontSize: '18px' }}>{props.entity_mobile}</Typography>
            </Stack>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Stack direction="column" flex={1}>
              <Typography sx={{ color: '#93A3B0', fontSize: '15px' }}>الهاتف:</Typography>
              <Typography sx={{ fontSize: '18px' }}>{props.phone}</Typography>
            </Stack>
            <Stack direction="column" flex={1}>
              <Typography sx={{ color: '#93A3B0', fontSize: '15px' }}>حساب تويتر:</Typography>
              <Typography sx={{ fontSize: '18px' }}>{props.twitter_acount}</Typography>
            </Stack>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Stack direction="column" flex={1}>
              <Typography sx={{ color: '#93A3B0', fontSize: '15px' }}>
                الموقع الإلكتروني:
              </Typography>
              <Typography sx={{ fontSize: '18px' }}>{props.website}</Typography>
            </Stack>
            <Stack direction="column" flex={1}>
              <Typography sx={{ color: '#93A3B0', fontSize: '15px' }}>
                البريد الإلكتروني:
              </Typography>
              <Typography sx={{ fontSize: '18px' }}>{props.email}</Typography>
            </Stack>
          </Stack>
          <Stack direction="column">
            <Typography sx={{ color: '#93A3B0', fontSize: '15px' }}>كلمة السر:</Typography>
            <Typography sx={{ fontSize: '18px' }}>{props.password}</Typography>
          </Stack>
        </Stack>
        <Stack direction="column" gap={2}>
          <Stack direction="row" justifyContent="space-between">
            <Typography color="#93A3B0" sx={{ fontSize: '18px', fontWeight: 700 }}>
              معلومات الترخيص
            </Typography>
            <IconButton
              sx={{
                backgroundColor: '#0169DE',
                borderRadius: '10px !important',
                '&:hover': { backgroundColor: '#1482FE' },
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_594_5260)">
                  <path
                    d="M15.2353 0.765364C14.7821 0.312828 14.1678 0.0586548 13.5273 0.0586548C12.8869 0.0586548 12.2726 0.312828 11.8193 0.765364L0.976677 11.608C0.666178 11.9168 0.419985 12.284 0.252342 12.6886C0.0846994 13.0931 -0.00106532 13.5268 9.98748e-06 13.9647V15.3334C9.98748e-06 15.5102 0.0702479 15.6797 0.195272 15.8048C0.320296 15.9298 0.489866 16 0.666677 16H2.03534C2.47319 16.0013 2.90692 15.9156 3.31145 15.7481C3.71597 15.5806 4.08325 15.3345 4.39201 15.024L15.2353 4.1807C15.6877 3.72749 15.9417 3.11334 15.9417 2.47303C15.9417 1.83272 15.6877 1.21857 15.2353 0.765364ZM3.44934 14.0814C3.07335 14.4549 2.56532 14.6652 2.03534 14.6667H1.33334V13.9647C1.33267 13.702 1.38411 13.4417 1.4847 13.199C1.58529 12.9563 1.73302 12.7359 1.91934 12.5507L10.148 4.32203L11.6813 5.85536L3.44934 14.0814ZM14.292 3.23803L12.6213 4.90936L11.088 3.37936L12.7593 1.70803C12.86 1.60757 12.9795 1.52792 13.111 1.47364C13.2424 1.41935 13.3833 1.39149 13.5255 1.39164C13.6678 1.3918 13.8086 1.41997 13.9399 1.47454C14.0712 1.52911 14.1905 1.60902 14.291 1.7097C14.3915 1.81038 14.4711 1.92986 14.5254 2.06132C14.5797 2.19278 14.6076 2.33365 14.6074 2.47588C14.6072 2.6181 14.5791 2.75891 14.5245 2.89025C14.4699 3.02159 14.39 3.1409 14.2893 3.24136L14.292 3.23803Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_594_5260">
                    <rect width="16" height="16" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </IconButton>
          </Stack>
          <Stack direction="column">
            <Typography sx={{ color: '#93A3B0', fontSize: '15px' }}>رقم الترخيص:</Typography>
            <Typography sx={{ fontSize: '18px' }}>{props.license_number}</Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Stack direction="column" flex={1}>
              <Typography sx={{ color: '#93A3B0', fontSize: '15px' }}>
                تاريخ اصدار الترخيص:
              </Typography>
              <Typography sx={{ fontSize: '20px' }}>
                {props.license_issue_date.toString()}
              </Typography>
            </Stack>
            <Stack direction="column" flex={1}>
              <Typography sx={{ color: '#93A3B0', fontSize: '15px' }}>
                تاريخ انتهاء الترخيص:
              </Typography>
              <Typography sx={{ fontSize: '18px' }}>{props.license_expired.toString()}</Typography>
            </Stack>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Stack direction="column" flex={1}>
              <Typography sx={{ color: '#93A3B0', fontSize: '15px' }}>ملف الترخيص:</Typography>
              <Typography sx={{ fontSize: '18px' }}>{props.license_file}</Typography>
            </Stack>
            <Stack direction="column" flex={1}>
              <Typography sx={{ color: '#93A3B0', fontSize: '15px' }}>
                ملف قرار تشكيل مجلس الإدارة:
              </Typography>
              <Typography sx={{ fontSize: '18px' }}>{props.board_ofdec_file}</Typography>
            </Stack>
          </Stack>
        </Stack>
        <Stack direction="column" gap={2}>
          <Stack direction="row" justifyContent="space-between">
            <Typography color="#93A3B0" sx={{ fontSize: '18px', fontWeight: 700 }}>
              البيانات الإدارية
            </Typography>
            <IconButton
              sx={{
                backgroundColor: '#0169DE',
                borderRadius: '10px !important',
                '&:hover': { backgroundColor: '#1482FE' },
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_594_5260)">
                  <path
                    d="M15.2353 0.765364C14.7821 0.312828 14.1678 0.0586548 13.5273 0.0586548C12.8869 0.0586548 12.2726 0.312828 11.8193 0.765364L0.976677 11.608C0.666178 11.9168 0.419985 12.284 0.252342 12.6886C0.0846994 13.0931 -0.00106532 13.5268 9.98748e-06 13.9647V15.3334C9.98748e-06 15.5102 0.0702479 15.6797 0.195272 15.8048C0.320296 15.9298 0.489866 16 0.666677 16H2.03534C2.47319 16.0013 2.90692 15.9156 3.31145 15.7481C3.71597 15.5806 4.08325 15.3345 4.39201 15.024L15.2353 4.1807C15.6877 3.72749 15.9417 3.11334 15.9417 2.47303C15.9417 1.83272 15.6877 1.21857 15.2353 0.765364ZM3.44934 14.0814C3.07335 14.4549 2.56532 14.6652 2.03534 14.6667H1.33334V13.9647C1.33267 13.702 1.38411 13.4417 1.4847 13.199C1.58529 12.9563 1.73302 12.7359 1.91934 12.5507L10.148 4.32203L11.6813 5.85536L3.44934 14.0814ZM14.292 3.23803L12.6213 4.90936L11.088 3.37936L12.7593 1.70803C12.86 1.60757 12.9795 1.52792 13.111 1.47364C13.2424 1.41935 13.3833 1.39149 13.5255 1.39164C13.6678 1.3918 13.8086 1.41997 13.9399 1.47454C14.0712 1.52911 14.1905 1.60902 14.291 1.7097C14.3915 1.81038 14.4711 1.92986 14.5254 2.06132C14.5797 2.19278 14.6076 2.33365 14.6074 2.47588C14.6072 2.6181 14.5791 2.75891 14.5245 2.89025C14.4699 3.02159 14.39 3.1409 14.2893 3.24136L14.292 3.23803Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_594_5260">
                    <rect width="16" height="16" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </IconButton>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Stack direction="column" flex={1}>
              <Typography sx={{ color: '#93A3B0', fontSize: '15px' }}>
                اسم المدير التنفيذي:
              </Typography>
              <Typography sx={{ fontSize: '18px' }}>{props.ceo_name}</Typography>
            </Stack>
            <Stack direction="column" flex={1}>
              <Typography sx={{ color: '#93A3B0', fontSize: '15px' }}>
                جوال المدير التنفيذي:
              </Typography>
              <Typography sx={{ fontSize: '18px' }}>{props.ceo_mobile}</Typography>
            </Stack>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Stack direction="column" flex={1}>
              <Typography sx={{ color: '#93A3B0', fontSize: '15px' }}>
                اسم مدخل البيانات:
              </Typography>
              <Typography sx={{ fontSize: '18px' }}>{props.data_entry_name}</Typography>
            </Stack>
            <Stack direction="column" flex={1}>
              <Typography sx={{ color: '#93A3B0', fontSize: '15px' }}>
                جوال مدخل البيانات:
              </Typography>
              <Typography sx={{ fontSize: '18px' }}>{props.data_entry_mobile}</Typography>
            </Stack>
          </Stack>
          <Stack direction="column">
            <Typography sx={{ color: '#93A3B0', fontSize: '15px' }}>بريد مدخل البيانات:</Typography>
            <Typography sx={{ fontSize: '18px' }}>{props.data_entry_mail}</Typography>
          </Stack>
        </Stack>
        <Stack direction="column" gap={2}>
          <Stack direction="row" justifyContent="space-between">
            <Typography color="#93A3B0" sx={{ fontSize: '18px', fontWeight: 700 }}>
              المعلومات البنكية
            </Typography>
            <IconButton
              sx={{
                backgroundColor: '#0169DE',
                borderRadius: '10px !important',
                '&:hover': { backgroundColor: '#1482FE' },
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_594_5260)">
                  <path
                    d="M15.2353 0.765364C14.7821 0.312828 14.1678 0.0586548 13.5273 0.0586548C12.8869 0.0586548 12.2726 0.312828 11.8193 0.765364L0.976677 11.608C0.666178 11.9168 0.419985 12.284 0.252342 12.6886C0.0846994 13.0931 -0.00106532 13.5268 9.98748e-06 13.9647V15.3334C9.98748e-06 15.5102 0.0702479 15.6797 0.195272 15.8048C0.320296 15.9298 0.489866 16 0.666677 16H2.03534C2.47319 16.0013 2.90692 15.9156 3.31145 15.7481C3.71597 15.5806 4.08325 15.3345 4.39201 15.024L15.2353 4.1807C15.6877 3.72749 15.9417 3.11334 15.9417 2.47303C15.9417 1.83272 15.6877 1.21857 15.2353 0.765364ZM3.44934 14.0814C3.07335 14.4549 2.56532 14.6652 2.03534 14.6667H1.33334V13.9647C1.33267 13.702 1.38411 13.4417 1.4847 13.199C1.58529 12.9563 1.73302 12.7359 1.91934 12.5507L10.148 4.32203L11.6813 5.85536L3.44934 14.0814ZM14.292 3.23803L12.6213 4.90936L11.088 3.37936L12.7593 1.70803C12.86 1.60757 12.9795 1.52792 13.111 1.47364C13.2424 1.41935 13.3833 1.39149 13.5255 1.39164C13.6678 1.3918 13.8086 1.41997 13.9399 1.47454C14.0712 1.52911 14.1905 1.60902 14.291 1.7097C14.3915 1.81038 14.4711 1.92986 14.5254 2.06132C14.5797 2.19278 14.6076 2.33365 14.6074 2.47588C14.6072 2.6181 14.5791 2.75891 14.5245 2.89025C14.4699 3.02159 14.39 3.1409 14.2893 3.24136L14.292 3.23803Z"
                    fill="white"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_594_5260">
                    <rect width="16" height="16" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </IconButton>
          </Stack>
          <Stack direction="row" justifyContent="space-between">
            <Stack direction="column" flex={1}>
              <Typography sx={{ color: '#93A3B0', fontSize: '15px' }}>
                رقم الحساب البنكي:
              </Typography>
              <Typography sx={{ fontSize: '18px' }}>{props.bank_account_number}</Typography>
            </Stack>
            <Stack direction="column" flex={1}>
              <Typography sx={{ color: '#93A3B0', fontSize: '15px' }}>
                اسم الحساب البنكي:
              </Typography>
              <Typography sx={{ fontSize: '18px' }}>{props.bank_account_name}</Typography>
            </Stack>
          </Stack>
          <Stack direction="column">
            <Typography sx={{ color: '#93A3B0', fontSize: '15px' }}>اسم البنك:</Typography>
            <Typography sx={{ fontSize: '18px' }}>{props.bank_name}</Typography>
          </Stack>
          <Stack direction="column">
            <Typography sx={{ color: '#93A3B0', fontSize: '15px' }}>
              صورة بطاقة الحساب البنكي:
            </Typography>
            <Typography sx={{ fontSize: '18px' }}>{props.card_image}</Typography>
          </Stack>
        </Stack>
        <Stack justifyContent="center" direction="row" gap={2} sx={{ height: '40px' }}>
          <Button
            sx={{
              color: '#000',
              size: 'large',
              width: { xs: '100%', sm: '200px' },
              hieght: { xs: '100%', sm: '50px' },
            }}
          >
            رجوع
          </Button>
          {/* <Button
            onClick={hanelSubmit}
            sx={{
              backgroundColor: 'background.paper',
              color: '#fff',
              width: { xs: '100%', sm: '200px' },
              hieght: { xs: '100%', sm: '50px' },
            }}
          >
            انشاء حساب
          </Button> */}
          <LoadingButton
            fullWidth
            size="large"
            variant="contained"
            loading={isSending}
            onClick={hanelSubmit}
            sx={{
              backgroundColor: 'background.paper',
              color: '#fff',
              width: { xs: '100%', sm: '200px' },
              hieght: { xs: '100%', sm: '50px' },
            }}
          >
            انشاء حساب
          </LoadingButton>
        </Stack>
      </Stack>
    </Container>
  );
}

export default FinalPage;

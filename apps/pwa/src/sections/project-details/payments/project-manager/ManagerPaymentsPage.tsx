import { Box, Button, Grid, Stack, Typography } from '@mui/material';
import PaymentsTable from './PaymentsTable';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from 'react';
import { useMutation } from 'urql';
import { updatePayment } from 'queries/project-supervisor/updatePayment';
import { useSnackbar } from 'notistack';

function ManagerPaymentsPage({ data, mutate }: any) {
  const { enqueueSnackbar } = useSnackbar();
  const [paymentToApprove, setPaymentToApprove] = useState<{
    id: string;
    order: number | undefined;
    payment_amount: number | undefined;
    payment_date: string;
    status: string;
  }>({ id: '', order: undefined, payment_amount: undefined, payment_date: '', status: '' });
  const [_, updatePay] = useMutation(updatePayment);

  useEffect(() => {
    for (var i = 0; i < data.payments.length; i++) {
      if (data.payments[i].status === 'ISSUED_BY_SUPERVISOR') {
        setPaymentToApprove(data.payments[i]);
        break;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleApprovalPayment = () => {
    const payload = {
      id: paymentToApprove.id,
      newState: { status: 'ACCEPTED_BY_PROJECT_MANAGER' },
    };
    updatePay(payload).then((result) => {
      if (!result.error) {
        enqueueSnackbar('The payment has been issued', {
          variant: 'success',
          preventDuplicate: true,
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'right',
          },
        });
        setPaymentToApprove({
          id: '',
          order: undefined,
          payment_amount: undefined,
          payment_date: '',
          status: '',
        });
        mutate();
      }
      if (result.error) {
        enqueueSnackbar(result.error.message, {
          variant: 'error',
          preventDuplicate: true,
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'right',
          },
        });
      }
    });
  };
  const handleRejectPayment = () => {
    console.log('handleRejectPayment');
  };
  return (
    <Grid container spacing={3} sx={{ mt: '8px' }}>
      {paymentToApprove.id !== '' && (
        <Grid item md={12} xs={12}>
          <Stack direction="column" gap={2}>
            <Typography variant="h5">{`معلومات إذن الصرف`}</Typography>
            <Stack direction="row" gap={2}>
              <Stack direction="column" flex={2}>
                <Typography>{`الأيبان ${data.user.bank_informations[0].bank_account_number}`}</Typography>
                {/* <Typography>
                  لوريم ايبسوم دولار سيت أميت ,كونسيكتيتور أدايبا يسكينج أليايت,سيت دو أيوسمود
                  تيمبور أنكايديديونتيوت لابوري ات دولار ماجنا أليكيوا . يوت انيم أد مينيم
                  فينايم,كيواس نوستريد أكسير سيتاشن يللأمكو لابورأس نيسي يت أليكيوب أكس أيا كوممودو
                  كونسيكيوات
                </Typography> */}
                {/* <Stack direction="row">
                  <Button
                    sx={{
                      backgroundColor: 'transparent',
                      color: '#93A3B0',
                      textDecorationLine: 'underline',
                      height: '100%',
                      ':hover': { backgroundColor: '#b8b7b4', textDecorationLine: 'underline' },
                      width: '40%',
                    }}
                  >
                    عرض إذن الصرف
                  </Button>
                  <Button
                    sx={{
                      backgroundColor: 'transparent',
                      color: '#93A3B0',
                      textDecorationLine: 'underline',
                      height: '100%',
                      ':hover': { backgroundColor: '#b8b7b4', textDecorationLine: 'underline' },
                      width: '40%',
                    }}
                  >
                    عرض خطاب الدعم
                  </Button>
                </Stack> */}
              </Stack>
              <Stack direction="row" gap={2} sx={{ alignItems: 'center' }}>
                <Button
                  sx={{
                    backgroundColor: '#FF4842',
                    color: '#fff',
                    ':hover': { backgroundColor: '#FF170F' },
                  }}
                  startIcon={<CloseIcon />}
                  onClick={handleRejectPayment}
                >
                  رفض إذن الصرف
                </Button>
                <Button
                  sx={{
                    backgroundColor: '#0E8478',
                    color: '#fff',
                  }}
                  startIcon={<CheckIcon />}
                  onClick={handleApprovalPayment}
                >
                  اعتماد إذن الصرف
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </Grid>
      )}
      <Grid item md={12}>
        <Typography variant="h4">ميزانية المشروع</Typography>
      </Grid>
      <Grid item md={2} xs={12}>
        <Box
          sx={{
            borderRadius: '8px',
            backgroundColor: '#fff',
            py: '30px',
            paddingRight: '40px',
            paddingLeft: '5px',
            height: '120px',
          }}
        >
          <Typography sx={{ color: '#93A3B0', fontSize: '10px', mb: '5px' }}>
            عدد الدفعات المسجلة
          </Typography>
          <Typography
            sx={{ color: 'text.tertiary', fontWeight: 700 }}
          >{`${data.number_of_payments} دفعات`}</Typography>
        </Box>
      </Grid>
      <Grid item md={2} xs={12}>
        <Box
          sx={{
            borderRadius: '8px',
            backgroundColor: '#fff',
            py: '30px',
            paddingRight: '40px',
            paddingLeft: '5px',
            height: '120px',
          }}
        >
          <img src={`/icons/rial-currency.svg`} alt="" />
          <Typography sx={{ color: '#93A3B0', fontSize: '10px', mb: '5px' }}>
            الميزانية الكلية للمشروع
          </Typography>
          <Typography
            sx={{ color: 'text.tertiary', fontWeight: 700 }}
          >{`${data.amount_required_fsupport} ريال`}</Typography>
        </Box>
      </Grid>
      <Grid item md={2} xs={12}>
        <Box
          sx={{
            borderRadius: '8px',
            backgroundColor: '#fff',
            py: '30px',
            paddingRight: '40px',
            paddingLeft: '5px',
            height: '120px',
          }}
        >
          <Typography sx={{ color: '#93A3B0', fontSize: '10px', mb: '5px' }}>
            المبلغ المصروف
          </Typography>
          <Typography sx={{ color: 'text.tertiary', fontWeight: 700 }}>20.000 ريال</Typography>
        </Box>{' '}
      </Grid>
      <Grid item md={12}>
        <Typography variant="h4">تقسيم الدفعات</Typography>
      </Grid>
      <Grid item md={12}>
        <PaymentsTable payments={data.payments} />
      </Grid>
    </Grid>
  );
}

export default ManagerPaymentsPage;

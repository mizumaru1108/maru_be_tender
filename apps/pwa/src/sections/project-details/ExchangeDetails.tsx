import Check from '@mui/icons-material/Check';
import { Box, Button, Grid, Stack, Typography, useTheme } from '@mui/material';
import { useSnackbar } from 'notistack';
import { updatePayment } from 'queries/project-supervisor/updatePayment';
import { useEffect, useState } from 'react';
import BankImageComp from 'sections/shared/BankImageComp';
import { useMutation } from 'urql';

function ExchangeDetails({ data, mutate }: any) {
  const { enqueueSnackbar } = useSnackbar();
  const [currentPayment, setCurrentPayment] = useState<{
    id: string;
    order: number | undefined;
    payment_amount: number | undefined;
    payment_date: string;
    status: string;
  }>({ id: '', order: undefined, payment_amount: undefined, payment_date: '', status: '' });
  const [beenIssued, setBeenIssued] = useState(false);
  const [_, updatePay] = useMutation(updatePayment);
  const theme = useTheme();
  useEffect(() => {
    for (var i = 0; i < data.payments.length; i++) {
      if (data.payments[i].status === 'ACCEPTED_BY_PROJECT_MANAGER') {
        setCurrentPayment(data.payments[i]);
        break;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const handleApprovalPayment = () => {
    const payload = { id: currentPayment?.id, newState: { status: 'ACCEPTED_BY_FINANCE' } };
    updatePay(payload).then((result) => {
      if (!result.error) {
        enqueueSnackbar('تم إصدار أذن الصرف بنجاح', {
          variant: 'success',
          preventDuplicate: true,
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'right',
          },
        });
        alert('The payment has been issued');
        setBeenIssued(true);
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
  console.log(currentPayment);
  if (data.payments.length === 0)
    return <>There is no Payments yet, Wait for the supervisor payments set or issued</>;

  if (currentPayment.id === '')
    return <>There is no Payments waits the Finance Section Acceptance ....</>;
  return (
    <>
      <Grid container>
        <Grid item md={8} xs={12}>
          <Stack direction="column" gap={3}>
            <Stack direction="column" gap={1}>
              <Typography variant="h5" fontWeight={800}>
                الإجراء السابق
              </Typography>
              <Typography color="#1E1E1E" fontWeight={400}>
                تم اصدار اذن الصرف الثالث من قسم المساجد - اسم الموظف / مجال العمل -
              </Typography>
              <Typography color="#93A3B0">تمت العملية بتاريخ 8-8-2022</Typography>
            </Stack>
            <Stack direction="column" gap={2}>
              <Typography variant="h5" fontWeight={800}>
                معلومات إذن الصرف
              </Typography>
              <Stack direction="column">
                <Typography color="#93A3B0">اسم الجهة :</Typography>
                <Typography>جمعية الدعوة الصناعية الجديدة بالرياض</Typography>
              </Stack>
              <Stack direction="row" gap={10} justifyContent="space-between">
                <Stack direction="column" flex={1}>
                  <Typography color="#93A3B0">اسم المشروع:</Typography>
                  <Typography>مشروع صيانة جامع جمعية الدعوة الصناعية الجديدة بالرياض</Typography>
                </Stack>
                <Stack direction="column" flex={1}>
                  <Typography color="#93A3B0">رقم المشروع:</Typography>
                  <Typography>تاريخ تنفيذ المشروع</Typography>
                </Stack>
              </Stack>
              <Stack direction="row" gap={10} justifyContent="space-between">
                <Stack direction="column" flex={1}>
                  <Typography color="#93A3B0">المنطقة:</Typography>
                  <Typography>المنطقة</Typography>
                </Stack>
                <Stack direction="column" flex={1}>
                  <Typography color="#93A3B0">المحافظة:</Typography>
                  <Typography>المحافظة</Typography>
                </Stack>
              </Stack>
              <Stack direction="column" gap={1}>
                <Typography color="#93A3B0">أهداف المشروع :</Typography>
                <Typography>
                  لوريم ايبسوم دولار سيت أميت ,كونسيكتيتور أدايبا يسكينج أليايت,سيت دو أيوسمود
                  تيمبور أنكايديديونتيوت لابوري ت دولار ماجنا أليكيوا . يوت انيم أد مينيم
                  فينايم,كيواس نوستريد أكسير سيتاشن يللأمكو لابورأس نيسي يت أليكيوب أكس أيا كوممودو
                  كونسيكيوات . ديواس أيوتي أريري دولار إن ريبريهينديرأيت فوليوبتاتي فيلايت أيسسي
                  كايلليوم دولار أيو فيجايت نيولا باراياتيور.
                </Typography>
              </Stack>
              <Stack direction="column">
                <Typography color="#93A3B0">مسار المشروع :</Typography>
                <Typography>مسار المساجد</Typography>
              </Stack>
              <Stack direction="row" gap={10} justifyContent="space-between">
                <Stack direction="column" flex={1}>
                  <Typography color="#93A3B0">رقم الدفعة:</Typography>
                  <Typography>3</Typography>
                </Stack>
                <Stack direction="column" flex={1}>
                  <Typography color="#93A3B0">مبلغ الدفعة:</Typography>
                  <Typography>10.000 ريال</Typography>
                </Stack>
              </Stack>
              <Stack direction="row" gap={10} justifyContent="space-between">
                <Stack direction="column" flex={1}>
                  <Typography color="#93A3B0">إجمالي الدعم:</Typography>
                  <Typography>20.000 ريال</Typography>
                </Stack>
                <Stack direction="column" flex={1}>
                  <Typography color="#93A3B0">هل يوجد اتفاقية:</Typography>
                  <Typography>لا</Typography>
                </Stack>
              </Stack>
              <Stack direction="column">
                <Typography color="#93A3B0">مخرجات الدعم (لصالح):</Typography>
                <Typography>
                  لوريم ايبسوم دولار سيت أميت ,كونسيكتيتور أدايبا يسكينج أليايت,سيت دو أيوسمود
                  تيمبور أنكايديديونتيوت لابوري ات دولار ماجنا أليكيوا . يوت انيم أد مينيم
                  فينايم,كيواس نوستريد أكسير سيتاشن يللأمكو لابورأس نيسي يت أليكيوب أكس أيا كوممودو
                  كونسيكيوات . ديواس أيوتي أريري دولار إن ريبريهينديرأيت فوليوبتاتي فيلايت أيسسي
                  كايلليوم دولار أيو فيجايت نيولا باراياتيور.
                </Typography>
              </Stack>
              <Stack direction="column">
                <Typography color="#93A3B0">مخرجات المشروع (نتائج المشروع):</Typography>
                <Typography>
                  لوريم ايبسوم دولار سيت أميت ,كونسيكتيتور أدايبا يسكينج أليايت,سيت دو أيوسمود
                  تيمبور أنكايديديونتيوت لابوري ات دولار ماجنا أليكيوا . يوت انيم أد مينيم
                  فينايم,كيواس نوستريد أكسير سيتاشن يللأمكو لابورأس نيسي يت أليكيوب أكس أيا كوممودو
                  كونسيكيوات . ديواس أيوتي أريري دولار إن ريبريهينديرأيت فوليوبتاتي فيلايت أيسسي
                  كايلليوم دولار أيو فيجايت نيولا باراياتيور.
                </Typography>
              </Stack>
              <Stack direction="row" gap={10} justifyContent="space-between">
                <Stack direction="column" flex={1}>
                  <Typography color="#93A3B0">مشرف المشروع:</Typography>
                  <Typography>مشرف المشروع</Typography>
                </Stack>
                <Stack direction="column" flex={1}>
                  <Typography color="#93A3B0">مدير الإدارة:</Typography>
                  <Typography>مدير الإدارة</Typography>
                </Stack>
              </Stack>
              <Stack direction="row" gap={10} justifyContent="space-between">
                <Stack direction="column" flex={1}>
                  <Typography color="#93A3B0">الرئيس التنفيذي:</Typography>
                  <Typography>الرئيس التنفيذي</Typography>
                </Stack>
                <Stack direction="column" flex={1}>
                  <Typography color="#93A3B0">أمين الصندوق:</Typography>
                  <Typography>أمين الصندوق</Typography>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
        </Grid>
        <Grid item md={4} xs={12}>
          <Stack direction="column" gap={10}>
            <Box>{''}</Box>
            <BankImageComp
              enableButton={true}
              bankName="البنك السعودي للاستثمار"
              bankAccountName="اسم الحساب البنكي"
              accountNumber="0000 0000 0000 0000"
            />
          </Stack>
        </Grid>
      </Grid>
      <Box
        sx={{
          backgroundColor: 'white',
          p: 3,
          borderRadius: 1,
          position: 'sticky',
          width: '100%',
          bottom: 24,
          border: `1px solid #fff}`,
          right: '255px',
        }}
      >
        <Grid container spacing={2} alignItems="center" justifyContent="space-around">
          <Grid item>
            <Button
              variant="outlined"
              startIcon={
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_5026_13413)">
                    <path
                      d="M15.2353 0.769209C14.7821 0.316673 14.1678 0.0625 13.5273 0.0625C12.8869 0.0625 12.2726 0.316673 11.8193 0.769209L0.976677 11.6119C0.666178 11.9206 0.419985 12.2879 0.252342 12.6924C0.0846994 13.0969 -0.00106532 13.5307 9.98748e-06 13.9685V15.3372C9.98748e-06 15.514 0.0702479 15.6836 0.195272 15.8086C0.320296 15.9336 0.489866 16.0039 0.666677 16.0039H2.03534C2.47318 16.0051 2.90692 15.9195 3.31145 15.752C3.71597 15.5844 4.08325 15.3383 4.39201 15.0279L15.2353 4.18454C15.6877 3.73134 15.9417 3.11719 15.9417 2.47688C15.9417 1.83657 15.6877 1.22241 15.2353 0.769209V0.769209ZM3.44934 14.0852C3.07335 14.4587 2.56532 14.669 2.03534 14.6705H1.33334V13.9685C1.33267 13.7058 1.38411 13.4456 1.4847 13.2028C1.58529 12.9601 1.73302 12.7398 1.91934 12.5545L10.148 4.32588L11.6813 5.85921L3.44934 14.0852ZM14.292 3.24188L12.6213 4.91321L11.088 3.38321L12.7593 1.71188C12.86 1.61141 12.9795 1.53177 13.111 1.47748C13.2424 1.4232 13.3833 1.39534 13.5255 1.39549C13.6678 1.39564 13.8086 1.42381 13.9399 1.47838C14.0712 1.53296 14.1905 1.61286 14.291 1.71354C14.3915 1.81422 14.4711 1.9337 14.5254 2.06516C14.5797 2.19663 14.6076 2.33749 14.6074 2.47972C14.6072 2.62195 14.5791 2.76275 14.5245 2.8941C14.4699 3.02544 14.39 3.14475 14.2893 3.24521L14.292 3.24188Z"
                      fill="white"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_5026_13413">
                      <rect width="16" height="16" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              }
              onClick={() => console.log('aksdlkasmdlk')}
              sx={{ backgroundColor: '#0169DE', color: '#fff' }}
            >
              ارسال طلب تعديل
            </Button>
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              endIcon={<Check />}
              sx={{ backgroundColor: '#0E8478' }}
              onClick={handleApprovalPayment}
            >
              قبول إذن الصرف
            </Button>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export default ExchangeDetails;

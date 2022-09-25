import { Box, Grid, Stack, Typography } from '@mui/material';
import BankImageComp from 'sections/shared/BankImageComp';

function ExchangeDetails() {
  const x = '';
  return (
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
                لوريم ايبسوم دولار سيت أميت ,كونسيكتيتور أدايبا يسكينج أليايت,سيت دو أيوسمود تيمبور
                أنكايديديونتيوت لابوري ت دولار ماجنا أليكيوا . يوت انيم أد مينيم فينايم,كيواس
                نوستريد أكسير سيتاشن يللأمكو لابورأس نيسي يت أليكيوب أكس أيا كوممودو كونسيكيوات .
                ديواس أيوتي أريري دولار إن ريبريهينديرأيت فوليوبتاتي فيلايت أيسسي كايلليوم دولار أيو
                فيجايت نيولا باراياتيور.
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
                لوريم ايبسوم دولار سيت أميت ,كونسيكتيتور أدايبا يسكينج أليايت,سيت دو أيوسمود تيمبور
                أنكايديديونتيوت لابوري ات دولار ماجنا أليكيوا . يوت انيم أد مينيم فينايم,كيواس
                نوستريد أكسير سيتاشن يللأمكو لابورأس نيسي يت أليكيوب أكس أيا كوممودو كونسيكيوات .
                ديواس أيوتي أريري دولار إن ريبريهينديرأيت فوليوبتاتي فيلايت أيسسي كايلليوم دولار أيو
                فيجايت نيولا باراياتيور.
              </Typography>
            </Stack>
            <Stack direction="column">
              <Typography color="#93A3B0">مخرجات المشروع (نتائج المشروع):</Typography>
              <Typography>
                لوريم ايبسوم دولار سيت أميت ,كونسيكتيتور أدايبا يسكينج أليايت,سيت دو أيوسمود تيمبور
                أنكايديديونتيوت لابوري ات دولار ماجنا أليكيوا . يوت انيم أد مينيم فينايم,كيواس
                نوستريد أكسير سيتاشن يللأمكو لابورأس نيسي يت أليكيوب أكس أيا كوممودو كونسيكيوات .
                ديواس أيوتي أريري دولار إن ريبريهينديرأيت فوليوبتاتي فيلايت أيسسي كايلليوم دولار أيو
                فيجايت نيولا باراياتيور.
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
  );
}

export default ExchangeDetails;

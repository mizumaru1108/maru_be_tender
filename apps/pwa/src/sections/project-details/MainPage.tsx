import { Box, Divider, Grid, Stack, Typography } from '@mui/material';
import React from 'react';
import BankImageComp from 'sections/shared/BankImageComp';

function MainPage() {
  return (
    <>
      <Stack direction="row" gap={6}>
        <Stack direction="column">
          <Typography sx={{ color: '#93A3B0', fontSize: '12px', mb: '5px' }}>
            عدد المستفيدين من المشروع:
          </Typography>
          <Typography sx={{ mb: '20px' }}>عدد المستفيدين من المشروع</Typography>
          <Typography sx={{ color: '#93A3B0', fontSize: '12px', mb: '5px' }}>
            مدة التنفيذ:
          </Typography>
          <Typography>مدة التنفيذ</Typography>
        </Stack>
        <Stack direction="column">
          <Typography sx={{ color: '#93A3B0', fontSize: '12px', mb: '5px' }}>
            مكان تنفيذ المشروع:
          </Typography>
          <Typography sx={{ mb: '20px' }}>مكان تنفيذ المشروع</Typography>
          <Typography sx={{ color: '#93A3B0', fontSize: '12px', mb: '5px' }}>
            نوع الفئة المستهدفة:
          </Typography>
          <Typography>نوع الفئة المستهدفة</Typography>
        </Stack>
        <Stack direction="column">
          <Typography sx={{ color: '#93A3B0', fontSize: '12px', mb: '5px' }}>
            تاريخ تنفيذ المشروع:
          </Typography>
          <Typography>تاريخ تنفيذ المشروع</Typography>
        </Stack>
      </Stack>
      <Divider />
      <Grid container columnSpacing={7}>
        <Grid item md={8} xs={12}>
          <Stack direction="column">
            <Typography sx={{ color: '#93A3B0', fontSize: '12px' }}>فكرة المشروع:</Typography>
            <Typography sx={{ mb: '10px' }}>
              لوريم ايبسوم دولار سيت أميت ,كونسيكتيتور أدايبا يسكينج أليايت,سيت دو أيوسمود تيمبور
              أنكايديديونتيوت لابوري ات دولار ماجنا أليكيوا . يوت انيم أد مينيم فينايم,كيواس نوستريد
              أكسير سيتاشن يللأمكو لابورأس نيسي يت أليكيوب أكس أيا كوممودو كونسيكيوات . ديواس أيوتي
              أريري دولار إن ريبريهينديرأيت فوليوبتاتي فيلايت أيسسي كايلليوم دولار أيو فيجايت نيولا
              باراياتيور.
            </Typography>
            <Typography sx={{ color: '#93A3B0', fontSize: '12px' }}>أهداف المشروع:</Typography>
            <Typography sx={{ mb: '10px' }}>
              لوريم ايبسوم دولار سيت أميت ,كونسيكتيتور أدايبا يسكينج أليايت,سيت دو أيوسمود تيمبور
              أنكايديديونتيوت لابوري ات دولار ماجنا أليكيوا . يوت انيم أد مينيم فينايم,كيواس نوستريد
              أكسير سيتاشن يللأمكو لابورأس نيسي يت أليكيوب أكس أيا كوممودو كونسيكيوات . ديواس أيوتي
              أريري دولار إن ريبريهينديرأيت فوليوبتاتي فيلايت أيسسي كايلليوم دولار أيو فيجايت نيولا
              باراياتيور.
            </Typography>
            <Typography sx={{ color: '#93A3B0', fontSize: '12px' }}>مخرجات المشروع:</Typography>
            <Typography sx={{ mb: '10px' }}>
              لوريم ايبسوم دولار سيت أميت ,كونسيكتيتور أدايبا يسكينج أليايت,سيت دو أيوسمود تيمبور
              أنكايديديونتيوت لابوري ات دولار ماجنا أليكيوا . يوت انيم أد مينيم فينايم,كيواس نوستريد
              أكسير سيتاشن يللأمكو لابورأس نيسي يت أليكيوب أكس أيا كوممودو كونسيكيوات . ديواس أيوتي
              أريري دولار إن ريبريهينديرأيت فوليوبتاتي فيلايت أيسسي كايلليوم دولار أيو فيجايت نيولا
              باراياتيور. أيكسسيبتيور ساينت أوككايكات كيوبايداتات نون بروايدينت ,سيونت ان كيولبا كيو
              أوفيسيا ديسيريونتموليت انيم أيدي ايست لابوريوم. سيت يتبيرسبايكياتيس يوندي أومنيس أستي
              ناتيس أيررور سيت فوليبتاتيم أكيسأنتييوم دولاريمكيو لايودانتيوم,توتام ريم أبيرأم,أيكيو
              أبسا كيواي أب أللو أنفينتوري فيرأتاتيس ايت كياسي أرشيتيكتو بيتاي فيتاي ديكاتا سيونت
              أكسبليكابو. نيمو أنيم أبسام فوليوباتاتيم كيواي
            </Typography>
            <Typography sx={{ color: '#93A3B0', fontSize: '12px' }}>نقاط القوة للمشروع:</Typography>
            <Typography sx={{ mb: '10px' }}>
              لوريم ايبسوم دولار سيت أميت ,كونسيكتيتور أدايبا يسكينج أليايت,سيت دو أيوسمود تيمبور
              أنكايديديونتيوت لابوري ات دولار ماجنا أليكيوا . يوت انيم أد مينيم فينايم,كيواس نوستريد
              أكسير سيتاشن يللأمكو لابورأس نيسي يت أليكيوب أكس أيا كوممودو كونسيكيوات . ديواس أيوتي
              أريري دولار إن ريبريهينديرأيت فوليوبتاتي فيلايت أيسسي كايلليوم دولار أيو فيجايت نيولا
              باراياتيور.
            </Typography>
            <Typography sx={{ color: '#93A3B0', fontSize: '12px' }}>مخاطر المشروع:</Typography>
            <Typography sx={{ mb: '10px' }}>
              لوريم ايبسوم دولار سيت أميت ,كونسيكتيتور أدايبا يسكينج أليايت,سيت دو أيوسمود تيمبور
              أنكايديديونتيوت لابوري ات دولار ماجنا أليكيوا . يوت انيم أد مينيم فينايم,كيواس نوستريد
              أكسير سيتاشن يللأمكو لابورأس نيسي يت أليكيوب أكس أيا كوممودو كونسيكيوات . ديواس أيوتي
              أريري دولار إن ريبريهينديرأيت فوليوبتاتي فيلايت أيسسي كايلليوم دولار أيو فيجايت نيولا
              باراياتيور.
            </Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-around">
            <Stack
              spacing={2}
              alignItems="center"
              justifyContent="space-between"
              direction={{ xs: 'column', md: 'row' }}
              sx={{
                textAlign: { xs: 'center', md: 'left' },
                backgroundColor: '#93A3B014',
                padding: '8px',
                borderRadius: '10px',
              }}
            >
              <Stack direction="row" gap={2}>
                <Stack direction="column" justifyContent="center">
                  <img src={`/icons/doc-icon.svg`} alt="" />
                </Stack>
                <Stack direction="column">
                  <Typography gutterBottom sx={{ fontSize: '13px' }}>
                    ملف خطاب طلب الدعم
                  </Typography>
                  <Typography gutterBottom sx={{ fontSize: '13px' }}>
                    126KB
                  </Typography>
                </Stack>
              </Stack>
              <img
                src={`/assets/icons/download-icon.svg`}
                alt=""
                style={{ width: 25, height: 25 }}
              />
            </Stack>
            <Stack
              spacing={2}
              alignItems="center"
              justifyContent="space-between"
              direction={{ xs: 'column', md: 'row' }}
              sx={{
                textAlign: { xs: 'center', md: 'left' },
                backgroundColor: '#93A3B014',
                padding: '8px',
                borderRadius: '10px',
              }}
            >
              <Stack direction="row" gap={2}>
                <Stack direction="column" justifyContent="center">
                  <img src={`/icons/pdf-icon.svg`} alt="" />
                </Stack>
                <Stack direction="column">
                  <Typography gutterBottom sx={{ fontSize: '13px' }}>
                    ملف مرفقات المشروع
                  </Typography>
                  <Typography gutterBottom sx={{ fontSize: '13px' }}>
                    126KB
                  </Typography>
                </Stack>
              </Stack>
              <img
                src={`/assets/icons/download-icon.svg`}
                alt=""
                style={{ width: 25, height: 25 }}
              />
            </Stack>
          </Stack>
        </Grid>
        <Grid item md={4} xs={12}>
          <Stack direction="column" gap={3}>
            <Stack direction="column">
              <Typography sx={{ color: '#93A3B0', fontSize: '12px', mb: '5px' }}>
                البريد الإلكتروني:
              </Typography>
              <Typography sx={{ mb: '20px' }}>البريد الإلكتروني</Typography>
            </Stack>
            <Stack direction="column">
              <Typography sx={{ color: '#93A3B0', fontSize: '12px', mb: '5px' }}>
                رقم الجوال:
              </Typography>
              <Typography sx={{ mb: '20px' }}>رقم الجوال</Typography>
            </Stack>
            <Stack direction="column">
              <Typography sx={{ color: '#93A3B0', fontSize: '12px', mb: '5px' }}>
                المحافظة:
              </Typography>
              <Typography sx={{ mb: '20px' }}>المحافظة</Typography>
            </Stack>
            <Box sx={{ backgroundColor: '#fff', py: '30px', pl: '10px' }}>
              <Stack direction="column">
                <Typography sx={{ color: '#93A3B0', fontSize: '12px', mb: '5px' }}>
                  المبلغ المطلوب للدعم:
                </Typography>
                <Typography sx={{ mb: '20px' }}>المبلغ المطلوب للدعم</Typography>
              </Stack>
            </Box>
            <Stack>
              <Typography sx={{ color: '#93A3B0', fontSize: '12px', mb: '5px' }}>
                المصرف المختار:
              </Typography>
              <BankImageComp
                enableButton={true}
                bankName={'البنك السعودي للاستثمار'}
                accountNumber={'000 999 888 777 666'}
                bankAccountName={'اسم الحساب البنكي'}
              />
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
}

export default MainPage;

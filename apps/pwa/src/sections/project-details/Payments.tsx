import { Box, Button, Grid, Stack, Typography } from '@mui/material';
function Payments() {
  const payments = [
    {
      payment_name: 'الدفعة الأولى',
      anount: '10.000 ريال',
      date: '30-8-2022',
      status: 'completed',
    },
    {
      payment_name: 'الدفعة الثانية',
      anount: '10.000 ريال',
      date: '30-9-2022',
      status: 'completed',
    },
    {
      payment_name: 'الدفعة الثالثة',
      anount: '10.000 ريال',
      date: '30-10-2022',
      status: 'pending',
    },
    {
      payment_name: 'الدفعة الرابعة',
      anount: '10.000 ريال',
      date: '30-11-2022',
      status: 'pending',
    },
    {
      payment_name: 'الدفعة الخامسة',
      anount: '10.000 ريال',
      date: '30-12-2022',
      status: 'pending',
    },
  ];
  return (
    <Grid container spacing={3} sx={{ mt: '8px' }}>
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
          }}
        >
          <Typography sx={{ color: '#93A3B0', fontSize: '10px', mb: '5px' }}>
            عدد الدفعات المسجلة
          </Typography>
          <Typography sx={{ color: 'text.tertiary', fontWeight: 700 }}>5 دفعات</Typography>
        </Box>{' '}
      </Grid>
      <Grid item md={2} xs={12}>
        <Box
          sx={{
            borderRadius: '8px',
            backgroundColor: '#fff',
            py: '30px',
            paddingRight: '40px',
            paddingLeft: '5px',
          }}
        >
          <img src={`/icons/rial-currency.svg`} alt="" />
          <Typography sx={{ color: '#93A3B0', fontSize: '10px', mb: '5px' }}>
            الميزانية الكلية للمشروع
          </Typography>
          <Typography sx={{ color: 'text.tertiary', fontWeight: 700 }}>500 ريال</Typography>
        </Box>{' '}
      </Grid>
      <Grid item md={2} xs={12}>
        <Box
          sx={{
            borderRadius: '8px',
            backgroundColor: '#fff',
            py: '30px',
            paddingRight: '40px',
            paddingLeft: '5px',
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
      {payments.map((item, index) => (
        <Grid item md={12} key={index}>
          <Grid container direction="row" key={index}>
            <Grid item md={2}>
              <Typography variant="h6">{item.payment_name}</Typography>
            </Grid>
            <Grid item md={2}>
              <Stack direction="column">
                <Typography sx={{ color: '#93A3B0' }}>تاريخ الدفعة:</Typography>
                <Typography sx={{ color: '#1E1E1E' }} variant="h6">
                  {item.anount}
                </Typography>
              </Stack>
            </Grid>
            <Grid item md={2}>
              <Stack direction="column">
                <Typography sx={{ color: '#93A3B0' }}>تاريخ الدفعة:</Typography>
                <Typography sx={{ color: '#1E1E1E' }} variant="h6">
                  {item.anount}
                </Typography>
              </Stack>
            </Grid>
            {item.status === 'completed' && (
              <>
                <Grid item md={3}>
                  <Typography sx={{ color: '#0E8478' }}>تم اصدار إذن الصرف</Typography>
                </Grid>
                <Grid item md={3}>
                  <Button
                    variant="outlined"
                    sx={{
                      color: '#93A3B0',
                      width: { xs: '100%', sm: '200px' },
                      hieght: '100px',
                      borderColor: '#93A3B0',
                      textDecorationLine: 'underline',
                    }}
                  >
                    استعراض ايصال التحويل
                  </Button>
                </Grid>
              </>
            )}
          </Grid>
        </Grid>
      ))}
    </Grid>
  );
}

export default Payments;

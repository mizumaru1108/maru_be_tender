import { Box, Button, Divider, Stack, Typography } from '@mui/material';

function UpcomingAppointments() {
  return (
    <Stack direction="column" gap={3}>
      <Typography sx={{ color: 'text.secondary', fontSize: '12px' }}>اجتماعات قادمة</Typography>
      <Box
        sx={{
          backgroundColor: '#fff',
          borderRadius: '10px',
          display: 'flex',
          direction: 'row',
          padding: '20px',
        }}
      >
        <Stack direction="column" flex={1}>
          <Typography sx={{ color: 'text.secondary', fontSize: '12px' }}>رقم المشروع:</Typography>
          <Typography sx={{ color: 'text.tertiary', fontSize: '17px' }}>{'asdasd'}</Typography>
        </Stack>
        <Divider orientation="vertical" flexItem sx={{ mr: '40px', ml: '-40px' }} />
        <Stack direction="column" flex={2}>
          <Typography sx={{ color: 'text.secondary', fontSize: '12px' }}>
            توقيت الاجتماع:
          </Typography>
          <Typography sx={{ fontWeight: 500, fontSize: '17px' }}>
            27-9-2022 12:00 - 02:00 مساءً
          </Typography>
        </Stack>
        <Stack direction="column" flex={2}>
          <Typography sx={{ color: 'text.secondary', fontSize: '12px' }}>الموظف:</Typography>
          <Typography sx={{ fontWeight: 500, fontSize: '17px' }}>مدير المشاريع</Typography>
        </Stack>
        <Stack direction="row" flex={2} justifyContent="space-around">
          <Button
            startIcon={
              <div>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip0_398_3192)">
                    <path
                      d="M15.2353 0.765303C14.7821 0.312767 14.1678 0.0585938 13.5273 0.0585938C12.8869 0.0585938 12.2726 0.312767 11.8193 0.765303L0.976677 11.608C0.666178 11.9167 0.419985 12.284 0.252342 12.6885C0.0846994 13.093 -0.00106532 13.5268 9.98748e-06 13.9646V15.3333C9.98748e-06 15.5101 0.0702479 15.6797 0.195272 15.8047C0.320296 15.9297 0.489866 16 0.666677 16H2.03534C2.47318 16.0012 2.90692 15.9156 3.31145 15.748C3.71597 15.5805 4.08325 15.3344 4.39201 15.024L15.2353 4.18064C15.6877 3.72743 15.9417 3.11328 15.9417 2.47297C15.9417 1.83266 15.6877 1.21851 15.2353 0.765303V0.765303ZM3.44934 14.0813C3.07335 14.4548 2.56532 14.6651 2.03534 14.6666H1.33334V13.9646C1.33267 13.7019 1.38411 13.4417 1.4847 13.1989C1.58529 12.9562 1.73302 12.7359 1.91934 12.5506L10.148 4.32197L11.6813 5.8553L3.44934 14.0813ZM14.292 3.23797L12.6213 4.9093L11.088 3.3793L12.7593 1.70797C12.86 1.60751 12.9795 1.52786 13.111 1.47358C13.2424 1.41929 13.3833 1.39143 13.5255 1.39158C13.6678 1.39174 13.8086 1.41991 13.9399 1.47448C14.0712 1.52905 14.1905 1.60896 14.291 1.70964C14.3915 1.81032 14.4711 1.9298 14.5254 2.06126C14.5797 2.19272 14.6076 2.33359 14.6074 2.47581C14.6072 2.61804 14.5791 2.75885 14.5245 2.89019C14.4699 3.02153 14.39 3.14084 14.2893 3.2413L14.292 3.23797Z"
                      fill="white"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_398_3192">
                      <rect width="16" height="16" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
            }
            sx={{
              backgroundColor: '#0169DE',
              color: '#fff',
              borderRadius: '10px',
              '&:hover': { backgroundColor: '#1482FE' },
              px: '7px',
              py: '0px',
              height: '45px',
              fontSize: '15px',
            }}
            onClick={() => console.log('asdlamsdkl')}
          >
            طلب إعادة جدولة
          </Button>
          <Button
            startIcon={
              <div>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M13.6627 5.31061L7.30267 0.643942C6.80593 0.280198 6.21815 0.0611376 5.60451 0.0110503C4.99087 -0.0390371 4.37535 0.0818059 3.8262 0.36018C3.27704 0.638553 2.81572 1.06358 2.49337 1.58813C2.17103 2.11268 2.00026 2.71626 2 3.33194V12.6653C2.00011 13.2812 2.17089 13.8851 2.49338 14.4099C2.81588 14.9347 3.27748 15.3599 3.82695 15.6382C4.37642 15.9166 4.99227 16.0372 5.60616 15.9868C6.22006 15.9364 6.80797 15.7169 7.30467 15.3526L13.6647 10.6859C14.0868 10.3763 14.4302 9.97165 14.6668 9.50465C14.9035 9.03765 15.0268 8.52148 15.0268 7.99794C15.0268 7.47441 14.9035 6.95823 14.6668 6.49124C14.4302 6.02424 14.0868 5.61954 13.6647 5.30994L13.6627 5.31061ZM12.8733 9.61061L6.51333 14.2773C6.21534 14.495 5.86291 14.6261 5.49505 14.6559C5.12718 14.6858 4.75824 14.6132 4.42904 14.4464C4.09985 14.2795 3.82326 14.0248 3.62987 13.7104C3.43648 13.3961 3.33385 13.0343 3.33333 12.6653V3.33194C3.32963 2.96217 3.43033 2.59886 3.62385 2.28376C3.81737 1.96865 4.09587 1.71454 4.42733 1.55061C4.70926 1.4072 5.02103 1.33229 5.33733 1.33194C5.76126 1.33356 6.17348 1.4712 6.51333 1.72461L12.8733 6.39127C13.1263 6.57707 13.332 6.81981 13.4738 7.09985C13.6156 7.3799 13.6895 7.68938 13.6895 8.00327C13.6895 8.31717 13.6156 8.62665 13.4738 8.9067C13.332 9.18674 13.1263 9.42948 12.8733 9.61528V9.61061Z"
                    fill="#0E8478"
                  />
                </svg>
              </div>
            }
            sx={{
              backgroundColor: '#fff',
              color: '#0E8478',
              borderRadius: '10px',
              '&:hover': { backgroundColor: '#fff' },
              px: '15px',
              py: '0px',
              height: '45px',
              fontSize: '15px',
            }}
            variant="outlined"
            onClick={() => console.log('asdlamsdkl')}
          >
            بدء الاجتماع
          </Button>
        </Stack>
      </Box>
    </Stack>
  );
}

export default UpcomingAppointments;

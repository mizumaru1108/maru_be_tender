import { Box, Grid, Typography } from '@mui/material';

function UnActivatedAccount() {
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: '70vh' }}
    >
      <Box
        sx={{
          width: '100%',
          height: '130px',
          borderRadius: '30px',
          backgroundColor: '#FFC107',
          position: 'relative',
        }}
      >
        <img
          src={'/icons/client-activate-icons/top-left.svg'}
          alt=""
          style={{
            width: '68.64px',
            height: '77.19px',
            position: 'absolute',
            left: '43.31px',
            top: '-40px',
          }}
        />

        <img
          src={'/icons/client-activate-icons/top-left-circul-1.svg'}
          style={{
            width: '22px',
            height: '22px',
            position: 'absolute',
            left: '85px',
            top: '32px',
          }}
          alt=""
        />
        <img
          src={'/icons/client-activate-icons/top-left-circul-2.svg'}
          style={{
            width: '8.32px',
            position: 'absolute',
            left: '72.04px',
            // zIndex: '1 !important',
            top: '65px',
          }}
          alt=""
        />
        <img
          src={'/icons/client-activate-icons/top-left-circul-3.svg'}
          style={{
            width: '5.55px',
            height: '5.55px',
            position: 'absolute',
            left: '25.22px',
            // zIndex: '1 !important',
            top: '30px',
          }}
          alt=""
        />
        <div
          style={{
            left: '0px',
            top: '52.8px',
            position: 'absolute',
            overflow: 'hidden',
            borderBottomLeftRadius: '30px',
          }}
        >
          <img
            src={'/icons/client-activate-icons/bottom-left.svg'}
            alt=""
            style={{ height: '77.19px' }}
          />
        </div>
        <Box
          style={{
            position: 'absolute',
            left: '276px',
            height: '100%',
            width: '575px',
            top: '17px',
          }}
        >
          <Typography variant="h6" sx={{ position: 'absolute', left: '152px', top: '15px' }}>
            لقد تم انشاء حسابك في غيث بنجاح
          </Typography>
          <Typography variant="h6" sx={{ position: 'absolute', left: '50px', top: '50px' }}>
            الرجاء الانتظار ليتم تفعيل حسابك لتستطيع انشاء مشاريع دعم
          </Typography>
        </Box>
      </Box>
      {/* <Box
        sx={{
          width: '100%',
          height: '115px',
          borderRadius: '5px',
          backgroundColor: '#FFC107',
          position: 'relative',
          top: '-114px',
          zIndex: '-2 !important',
          overflow: 'hidden',
        }}
        style={{ borderRadius: '30px' }}
      >
        <img
          src={'/icons/client-activate-icons/bottom-left.svg'}
          alt=""
          style={{ position: 'absolute', zIndex: '3 !important' }}
        />
      </Box> */}
    </Grid>
  );
}

export default UnActivatedAccount;

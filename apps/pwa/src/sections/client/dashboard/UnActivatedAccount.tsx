import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import Page from 'components/Page';
import useAuth from 'hooks/useAuth';
import useResponsive from 'hooks/useResponsive';

function UnActivatedAccount() {
  const isMobile = useResponsive('down', 'sm');
  const { activeRole } = useAuth();
  return (
    <Page title="Un Activated Page">
      <Container sx={{ paddingTop: '20px' }}>
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
          style={{ height: '70vh' }}
        >
          <Box
            sx={{
              width: '100%',
              height: isMobile ? '100%' : '130px',
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
            {isMobile ? (
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  width: '100%',
                }}
              >
                {activeRole === 'tender_client' ? (
                  <Stack>
                    <Typography variant="h6" sx={{ alignSelf: 'center' }}>
                      لقد تم انشاء حسابك في غيث بنجاح
                    </Typography>
                    <Typography variant="h6" sx={{ alignSelf: 'center' }}>
                      الرجاء الانتظار ليتم تفعيل حسابك
                    </Typography>
                    <Typography variant="h6" sx={{ alignSelf: 'center' }}>
                      لتستطيع انشاء مشاريع دعم
                    </Typography>
                  </Stack>
                ) : (
                  <Stack>
                    <Typography variant="h6" sx={{ alignSelf: 'center' }}>
                      هذا الحساب غير مفعل
                    </Typography>
                    <Typography variant="h6" sx={{ alignSelf: 'center' }}>
                      يرجى التواصل مع الأدمن لتفعيله
                    </Typography>
                  </Stack>
                )}
              </div>
            ) : (
              <div
                style={{
                  position: 'absolute',
                  top: '30%',
                  width: '100%',
                }}
              >
                {activeRole === 'tender_client' ? (
                  <Stack>
                    <Typography variant="h6" sx={{ alignSelf: 'center' }}>
                      لقد تم انشاء حسابك في غيث بنجاح
                    </Typography>
                    <Typography variant="h6" sx={{ alignSelf: 'center' }}>
                      الرجاء الانتظار ليتم تفعيل حسابك لتستطيع انشاء مشاريع دعم
                    </Typography>
                  </Stack>
                ) : (
                  <Stack>
                    <Typography variant="h6" sx={{ alignSelf: 'center' }}>
                      هذا الحساب غير مفعل
                    </Typography>
                    <Typography variant="h6" sx={{ alignSelf: 'center' }}>
                      يرجى التواصل مع الأدمن لتفعيله
                    </Typography>
                  </Stack>
                )}
              </div>
            )}
          </Box>
        </Grid>
      </Container>
    </Page>
  );
}

export default UnActivatedAccount;

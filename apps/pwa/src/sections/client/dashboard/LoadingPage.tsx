import { Container, Grid, Skeleton, Stack, Tab, Tabs, Typography } from '@mui/material';

function LoadingPage() {
  const tap = 'all_projects';
  return (
    <Grid container rowSpacing={8}>
      <Grid item md={12} xs={12}>
        <Skeleton
          variant="rectangular"
          height="150px"
          animation="wave"
          sx={{ bgcolor: 'grey.250' }}
        />
      </Grid>
      <Grid item md={12} xs={12}>
        <Container>
          <Grid container columnSpacing={7} rowSpacing={5}>
            <Grid item md={8} xs={12}>
              <Stack gap={3}>
                <Typography variant="h4">المشروع الحالي</Typography>
                <Skeleton
                  variant="rectangular"
                  height="200px"
                  width="100%"
                  animation="wave"
                  sx={{ bgcolor: 'grey.250' }}
                />
              </Stack>
            </Grid>
            <Grid item md={4} xs={12} rowSpacing={7}>
              <Stack gap={3}>
                <Typography variant="h4">الميزانية الحالية</Typography>
                <Stack direction="column" gap={3}>
                  <Stack direction="row" gap={1}>
                    <Skeleton
                      variant="rectangular"
                      height="200px"
                      width="150px"
                      animation="wave"
                      sx={{
                        borderRadius: '8px',
                        bgcolor: 'grey.250',
                        py: '30px',
                        paddingRight: '40px',
                        paddingLeft: '5px',
                      }}
                    />
                    <Skeleton
                      variant="rectangular"
                      height="200px"
                      width="150px"
                      animation="wave"
                      sx={{
                        borderRadius: '8px',
                        bgcolor: 'grey.250',
                        py: '30px',
                        paddingRight: '40px',
                        paddingLeft: '5px',
                      }}
                    />
                  </Stack>
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Grid>
      <Grid item md={12} xs={12}>
        <Container>
          <Typography variant="h4">مشاريع محفوظة كمسودة</Typography>
          <Grid container sx={{ pt: 2 }} spacing={5}>
            <Grid item md={6} xs={12}>
              <Skeleton
                variant="rectangular"
                height="200px"
                animation="wave"
                sx={{ bgcolor: 'grey.250' }}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <Skeleton
                variant="rectangular"
                height="200px"
                animation="wave"
                sx={{ bgcolor: 'grey.250' }}
              />
            </Grid>
          </Grid>
        </Container>
      </Grid>
      <Grid item md={12} xs={12}>
        <Container>
          <Grid container>
            <Grid item md={12} xs={12}>
              <Typography variant="h4">طلبات دعم سابقة</Typography>
            </Grid>
            <Grid item md={12} xs={12}>
              <Tabs
                onChange={() => {}}
                value={tap}
                aria-label="Tabs where selection follows focus"
                selectionFollowsFocus
              >
                <Tab label="كل المشاريع" value="all_projects" />
                <Tab label="مشاريع منتهية" value="completed_projects" />
                <Tab label="مشاريع معلقة" value="pending_projects" />
              </Tabs>
            </Grid>
            <Grid item md={6} xs={12}>
              <Skeleton
                variant="rectangular"
                height="200px"
                animation="wave"
                sx={{ bgcolor: 'grey.250' }}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <Skeleton
                variant="rectangular"
                height="200px"
                animation="wave"
                sx={{ bgcolor: 'grey.250' }}
              />
            </Grid>
          </Grid>
        </Container>
      </Grid>
    </Grid>
  );
}

export default LoadingPage;

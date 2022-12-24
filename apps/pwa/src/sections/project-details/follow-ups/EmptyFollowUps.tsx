import { Box, Container, Grid, Stack, Typography } from '@mui/material';
import SvgIconStyle from 'components/SvgIconStyle';

function EmptyFollowUps() {
  return (
    <Container>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        p="20px"
        style={{ minHeight: '30vh' }}
      >
        <Box sx={{ width: '100%' }}>
          <Stack justifyItems="center" gap={1}>
            <Box sx={{ textAlign: 'center' }}>
              <SvgIconStyle src={`/icons/empty-project.svg`} />
            </Box>
            <Typography variant="h6" sx={{ textAlign: 'center' }}>
              لا يوجد اي متابعات
            </Typography>
            <Typography sx={{ textAlign: 'center', color: '#93A3B0' }}>
              قم بإضافة تعليق او رفع ملف
            </Typography>
          </Stack>
        </Box>
      </Grid>
    </Container>
  );
}

export default EmptyFollowUps;

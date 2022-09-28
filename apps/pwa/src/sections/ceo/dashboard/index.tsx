import { Grid } from '@mui/material';
import Complexity from './Complexity';
import Concessional from './Concessional';
import Initiatives from './Initiatives';
import Mosques from './Mosques';
import ProjectManagement from './ProjectManagement';

function DashboardPage() {
  return (
    <>
      <Grid container rowSpacing={0} columnSpacing={0} gap={0}>
        <Grid item md={6}>
          <Concessional />
        </Grid>
        <Grid item md={6}>
          <Mosques />
        </Grid>
        <Grid item md={6}>
          <Complexity />
        </Grid>
        <Grid item md={6}>
          <Initiatives />
        </Grid>
      </Grid>
      <ProjectManagement />
    </>
  );
}

export default DashboardPage;

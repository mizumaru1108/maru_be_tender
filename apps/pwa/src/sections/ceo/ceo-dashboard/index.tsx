import { Grid, Typography } from '@mui/material';
import DailyStatistics from './DailyStatistics';
import TrackBudget from './TrackBudget';
import Complexity from './Complexity';
import Concessional from './Concessional';
import Initiatives from './Initiatives';
import Mosques from './Mosques';
import DashboardProjectManagement from './ProjectManagement';
const dailyStatistic = [
  {
    subtitle: 'الميزانية الكلية للمؤسسة',
    type: {
      label: 'section_portal_reports.riyals',
      value: 1000000,
    },
    height: '140',
    icon: true,
    compareValue: '10',
    color: 'up',
  },
  {
    subtitle: 'الميزانية المصروفة',
    type: {
      label: 'section_portal_reports.riyals',
      value: 1000000,
    },
    height: '140',
    icon: true,
    compareValue: '10',
    color: 'stable',
  },
  {
    subtitle: 'الميزانية المحجوزة',
    type: {
      label: 'section_portal_reports.riyals',
      value: 1000000,
    },
    height: '140',
    icon: true,
    compareValue: '10',
    color: 'down',
  },
];
function CeoDashboard() {
  return (
    <>
      <Grid container spacing={5}>
        <Grid item md={12}>
          <DailyStatistics />
        </Grid>
        <Grid item md={12}>
          <Grid container spacing={4}>
            <Grid item md={12} xs={12}>
              <Typography variant="h4">الميزانية الكلية للمؤسسة</Typography>
            </Grid>
            <Grid item md={12} xs={12}>
              <TrackBudget data={dailyStatistic} />
            </Grid>
          </Grid>
        </Grid>
        {/* <Grid item md={6}>
          <Mosques />
        </Grid> */}
        {/* <Grid item md={6}>
          <Concessional />
        </Grid>
        <Grid item md={6}>
          <Complexity />
        </Grid>
        <Grid item md={6}>
          <Initiatives />
        </Grid> */}
      </Grid>
      <DashboardProjectManagement />
    </>
  );
}

export default CeoDashboard;

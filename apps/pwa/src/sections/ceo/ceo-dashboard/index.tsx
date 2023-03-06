import { Grid, Typography } from '@mui/material';
import DailyStatistics from './DailyStatistics';
import TrackBudget from './TrackBudget';
import Complexity from './Complexity';
import Concessional from './Concessional';
import Initiatives from './Initiatives';
import Mosques from './Mosques';
import DashboardProjectManagement from './ProjectManagement';
import ProposalOnAmandementTable from '../../../components/table/ceo/proposal-on-amandement/ProposalOnAmandementTable';
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
          <TrackBudget />
        </Grid>
        <Grid item md={12}>
          <DashboardProjectManagement />
        </Grid>
        <Grid item md={12}>
          <ProposalOnAmandementTable />
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
    </>
  );
}

export default CeoDashboard;

import { Typography, Box, Grid } from '@mui/material';
import useLocales from 'hooks/useLocales';
// component
import LineCharts from 'components/line-charts';
// _mock
import { CONCESSIONAL_TRACK } from '_mock/portal_reports';

export default function ConcessionalTrack() {
  const { translate } = useLocales();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'start',
        flexDirection: 'column',
        rowGap: 4,
        mt: 2,
      }}
    >
      <Typography variant="h4">
        {translate('section_portal_reports.heading.concessional_track_budget')}
      </Typography>
      <Grid container spacing={3}>
        {CONCESSIONAL_TRACK.map((item, i) => (
          <Grid xs={6} md={4} item key={i}>
            <LineCharts
              lineChartData={item.lineChartData}
              seriesData={item.seriesData}
              categories={item.categories}
              height={item.height}
              subtitle={item.subtitle}
              compareValue={item.compareValue}
              type={item.type}
              icon={item.icon}
              color={item.color}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
import { Typography, Box, Grid } from '@mui/material';
import useLocales from 'hooks/useLocales';
// component
import LineCharts from 'components/line-charts';
// _mock
import { MockLineChart } from '_mock/portal_reports';

export default function AverageTransaction() {
  const { translate } = useLocales();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'start',
        flexDirection: 'column',
        rowGap: 4,
        mt: 1,
      }}
    >
      <Typography variant="h4">
        {translate('section_portal_reports.heading.average_transaction')}
      </Typography>
      <Grid container spacing={3}>
        {MockLineChart.map((item, i) => (
          <Grid xs={6} md={4} item key={i}>
            <LineCharts
              lineChartData={item.lineChartData}
              seriesData={item.seriesData}
              categories={item.categories}
              height={item.height}
              type={item.type}
              compareValue={item.compareValue}
              title={item.title}
              color={item.color}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

import { Box, Card, CardHeader, Container, Grid, Stack, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import Page from 'components/Page';
import BarChart from '../../components/chart/BarChart';
import DonutChart from '../../components/chart/DonutChart';
import useLocales from '../../hooks/useLocales';
import { dataAccount } from './mock-data';

function PortalReports() {
  const ContentStyle = styled('div')(({ theme }) => ({
    maxWidth: '100%',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'start',
    flexDirection: 'column',
  }));

  const { translate } = useLocales();

  const series: ApexAxisChartSeries | ApexNonAxisChartSeries = [
    {
      name: translate('ceo_portal_reports.bar_chart.series_name.last_month'),
      data: [10, 13, 25, 23], //TODO: get data from API
    },
    {
      name: translate('ceo_portal_reports.bar_chart.series_name.this_month'),
      data: [13, 33, 15, 18], //TODO: get data from API
    },
  ];

  const axisLabel: string[] = [
    translate('ceo_portal_reports.bar_chart.label.partners_need_to_active'),
    translate('ceo_portal_reports.bar_chart.label.active_partners'),
    translate('ceo_portal_reports.bar_chart.label.rejected_partners'),
    translate('ceo_portal_reports.bar_chart.label.pending_partners'),
  ];

  const axisLabel1: string[] = [
    'منطقة 1',
    'منطقة 2',
    'منطقة 3',
    'منطقة 4',
    'منطقة 5',
    'منطقة 6',
    'منطقة 7',
    'منطقة 8',
    'منطقة 9',
    'منطقة 10',
    'منطقة 11',
    'منطقة 12',
    'منطقة 13',
    'منطقة 14',
  ];
  const series1: ApexAxisChartSeries | ApexNonAxisChartSeries = [
    {
      name: translate('ceo_portal_reports.bar_chart.series_name.last_month'),
      data: [10, 13, 25, 23, 10, 13, 25, 23, 10, 13, 25, 23, 12, 10], //TODO: get data from API
    },
  ];
  const axisLabel2: string[] = [
    'محافظة 1',
    'محافظة 2',
    'محافظة 3',
    'محافظة 4',
    'محافظة 5',
    'محافظة 6',
    'محافظة 7',
    'محافظة 8',
  ];
  const series2: ApexAxisChartSeries | ApexNonAxisChartSeries = [
    {
      name: translate('ceo_portal_reports.bar_chart.series_name.last_month'),
      data: [10, 13, 25, 23, 10, 13, 25, 23], //TODO: get data from API
    },
  ];
  return (
    <Page title="Contact And Support">
      <Container>
        <ContentStyle>
          <Grid container direction="row">
            {/* <Grid item xs={12} md={6}>
              <DonutChart data={dataAccount} headLine="حسب حالة الشريك" type="accounts" />
            </Grid> */}
            <Grid item xs={12} md={6}>
              <BarChart
                headline={translate('ceo_portal_reports.bar_chart.headline.partners')}
                data={series}
                xAxisDatas={axisLabel}
                barRenderBorderRadius={12}
              />
            </Grid>
            <Grid item xs={12} md={12} sx={{ heigh: '200px' }}>
              <BarChart
                headline={'حسب المنطقة'}
                data={series1}
                xAxisDatas={axisLabel1}
                barRenderBorderRadius={12}
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <BarChart
                headline={'حسب المحافظة'}
                data={series2}
                xAxisDatas={axisLabel2}
                barRenderBorderRadius={12}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Stack sx={{ height: '100%' }} justifyContent="center">
                <img src="/map-test.svg" alt="" />
              </Stack>
            </Grid>
          </Grid>
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default PortalReports;

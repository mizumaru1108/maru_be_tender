import { Box, Card, CardHeader, Container, Grid, Typography } from '@mui/material';
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
  return (
    <Page title="Contact And Support">
      <Container>
        <ContentStyle>
          <Grid container direction="row">
            <Grid item xs={12} md={6}>
              <DonutChart
                data={dataAccount}
                headLine="Depending on the partner's condition"
                type="accounts"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <BarChart
                headline={translate('ceo_portal_reports.bar_chart.headline.partners')}
                data={series}
                xAxisDatas={axisLabel}
                barRenderBorderRadius={12}
              />
            </Grid>
          </Grid>
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default PortalReports;

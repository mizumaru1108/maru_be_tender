import { Box, Grid, Stack } from '@mui/material';
import BarChart from 'components/chart/BarChart';
import DonutChart from 'components/chart/DonutChart';
import useLocales from 'hooks/useLocales';
import { dataAccount } from './mock-data';
import ProjectBenidiciaresKinds from './ProjectBenidiciaresKinds';
import ProjectBenificiares from './ProjectBenificiares';
import PtojectsNumbers from './PtojectsNumbers';

function ProjectsInformation() {
  const { translate } = useLocales();
  const axisLabel: string[] = [
    'آخرى',
    'المؤسسة العامة للتدريب التقني والمهني',
    'هيئة الأوقاف',
    'وزارة التجارة والاستثمار',
    'وزارة التعليم',
    'وزارة الشؤون الإسلامية',
    'وزارة العدل',
    'وزارة الموارد البشرية والتنمية الاجتماعية',
  ];
  const series: ApexAxisChartSeries | ApexNonAxisChartSeries = [
    {
      name: translate('ceo_portal_reports.bar_chart.series_name.last_month'),
      data: [10, 13, 25, 23, 10, 13, 25, 23], //TODO: get data from API
    },
  ];
  const series1: ApexAxisChartSeries | ApexNonAxisChartSeries = [
    {
      name: translate('ceo_portal_reports.bar_chart.series_name.last_month'),
      data: [10, 13, 25, 23, 10, 13, 25, 23, 10, 13, 25, 23, 12, 10], //TODO: get data from API
    },
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
  const benificiaresDataKind = {
    men: {
      label: 'رجال',
      value: 150,
    },
    teen: {
      label: 'شباب',
      value: 100,
    },
    women: {
      label: 'فتيات',
      value: 150,
    },
  };
  return (
    <Box>
      <Grid container direction="row" columnSpacing={3}>
        <Grid item xs={12} md={6}>
          <DonutChart data={dataAccount} headLine="مسار المساجد" type="accounts" />
        </Grid>
        <Grid item xs={12} md={6}>
          <DonutChart data={dataAccount} headLine="مسار المنح العام" type="accounts" />
        </Grid>
        <Grid item xs={12} md={6}>
          <DonutChart data={dataAccount} headLine="مسار المبادرات" type="accounts" />
        </Grid>
        <Grid item xs={12} md={6}>
          <DonutChart data={dataAccount} headLine="مسار تعميدات الشيخ" type="accounts" />
        </Grid>
        <Grid item xs={12} md={12}>
          <BarChart
            headline={'حسب الجهة'}
            data={series}
            xAxisDatas={axisLabel}
            barRenderBorderRadius={12}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <PtojectsNumbers
            title="العدد الكلي للطلبات"
            chartData={[
              { label: 'خطة:', value: 14 },
              { label: 'وارد:', value: 7 },
              { label: 'تعميد:', value: 27 },
            ]}
            chartColors={['#0E8478', '#1E1E1E', '#93A3B0']}
          />
        </Grid>
        <Grid item md={6} xs={12}>
          <PtojectsNumbers
            title="العدد الكلي للطلبات"
            chartData={[
              { label: 'دعم كلي::', value: 14 },
              { label: 'دعم جزء::', value: 27 },
            ]}
            chartColors={['#0E8478', '#93A3B0']}
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
        <Grid item md={6} xs={12}>
          <ProjectBenificiares
            title="العدد الكلي للمستفيدين من المشاريع"
            chartData={[
              { label: 'مسار المساجد:', value: 100 },
              { label: 'مسار المنح العام:', value: 200 },
              { label: 'مسار المبادرات:', value: 75 },
              { label: 'مسار تعميدات الشيخ:', value: 25 },
            ]}
            chartColors={['#0E8478', '#FFC107', '#FF4842', '#0169DE']}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <ProjectBenidiciaresKinds
            data={benificiaresDataKind}
            headLine="نوع المتسفيدين من المشاريع"
            type="accounts"
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default ProjectsInformation;

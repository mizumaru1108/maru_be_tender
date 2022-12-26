import { Box, Card, CardHeader, Container, Grid, Typography } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { ApexOptions } from 'apexcharts';
import { BaseOptionChart } from 'components/chart';
import Page from 'components/Page';
import useLocales from 'hooks/useLocales';
import merge from 'lodash/merge';
import ReactApexChart from 'react-apexcharts';
import { fNumber } from 'utils/formatNumber';
import { IDonatChartProps } from './types';

const CHART_HEIGHT = 392;
const LEGEND_HEIGHT = 72;
const CHART_WIDTH = 600;

export default function DonutChart({ data, type, headLine }: IDonatChartProps) {
  const { translate, currentLang } = useLocales();
  const theme = useTheme();
  const ChartWrapperStyle = styled('div')(({ theme }) => ({
    height: CHART_HEIGHT,
    marginTop: theme.spacing(5),
    '& .apexcharts-canvas svg': { height: CHART_HEIGHT, width: CHART_WIDTH },
    '& .apexcharts-canvas svg,.apexcharts-canvas foreignObject': {
      overflow: 'visible',
    },
    '& .apexcharts-legend': {
      maxHeight: '250px !important',
      display: 'flex !important',
      flexWrap: 'wrap !important',
      [theme.breakpoints.up('lg')]: {
        flexWrap: 'wrap',
        height: 250,
        width: '50%',
      },
    },
    '& .apexcharts-legend-series': {
      flex: '35%',
      width: '40%',
    },
    '& .apexcharts-datalabels-group': {
      display: 'none',
    },
    '& .apexcharts-inner': {
      transform:
        currentLang.label === 'English'
          ? `translateX(${0}%) translateY(${0})`
          : `translateX(${-55}%) translateY(${0})`,
    },
  }));
  const chartData = [
    {
      label: type === 'accounts' ? data.processing.label : data.accepted.label,
      value: type === 'accounts' ? data.processing.value : data.accepted.value,
    },
    {
      label: type === 'accounts' ? data.accepted.label : data.processing.label,
      value: type === 'accounts' ? data.accepted.value : data.processing.value,
    },
    { label: data.rejected.label, value: data.rejected.value },
    { label: data.pending.label, value: data.pending.value },
  ];
  const chartSeries = chartData.map((i) => i.value);
  const chartLabels = chartData.map((i) => i.label);
  const chartOptions: ApexOptions = {
    colors: ['#0E8478', '#13B2A2', '#FF4842', '#FFC107'],
    labels: chartLabels,
    legend: {
      show: true,
      floating: false,
      horizontalAlign: 'center',
      offsetX: 10,
      offsetY: -30,
      position: currentLang.label === 'English' ? 'right' : 'left',
      formatter(legendName: any, opts?: any) {
        return `${legendName} : </br> ${fNumber(opts.w.globals.series[opts.seriesIndex])}`;
      },
      itemMargin: {
        horizontal: 0,
        vertical: 0,
      },
      markers: {
        width: 10,
        height: 10,
      },
    },
    dataLabels: {
      enabled: false,
      formatter: (val: number) => fNumber(val),
    },
    plotOptions: {
      pie: {
        startAngle: 10,
        endAngle: 300,
        expandOnClick: false,
        donut: {
          size: '90%',
        },
      },
    },
  };
  return (
    <>
      <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Cairo', fontStyle: 'Bold' }}>
        {/* التقارير */}
        {headLine}
      </Typography>
      <ChartWrapperStyle>
        <ReactApexChart type="donut" series={chartSeries} options={chartOptions} height={280} />
      </ChartWrapperStyle>
    </>
  );
}

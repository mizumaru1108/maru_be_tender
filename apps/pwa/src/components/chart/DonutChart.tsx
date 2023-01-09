import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';
// @mui
import { Typography, styled, useTheme } from '@mui/material';
// hooks
import useLocales from 'hooks/useLocales';
// utils
import { fNumber } from 'utils/formatNumber';
//
import { IDonatChartProps } from './types';

const CHART_HEIGHT = 200;
const CHART_WIDTH = 600;

export default function DonutChart({ headline, data, anotherData }: IDonatChartProps) {
  const { translate, currentLang } = useLocales();
  const theme = useTheme();

  const ChartWrapperStyle = styled('div')(({ theme }) => ({
    height: CHART_HEIGHT,
    marginTop: theme.spacing(3),
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
      flexShrink: 1,
      flexGrow: 0.15,
      flexBasis: '25%',
    },
    '& .apexcharts-datalabels-group': {
      display: 'none',
    },
    '& .apexcharts-inner': {
      transform:
        currentLang.label === 'English'
          ? `translateX(${0}%) translateY(${0})`
          : `translateX(${anotherData ? 55 : -55}%) translateY(${0})`,
    },
  }));

  let newChartData, newChartSeries: number[], newChartLabels: string[];

  if (anotherData && anotherData.length) {
    newChartData = anotherData.map((v) => ({ label: translate(v.label), value: v.value }));
    newChartSeries = anotherData.map((v) => v.value);
    newChartLabels = anotherData.map((v) => translate(v.label));
  } else {
    newChartData = [
      { label: translate(data?.ongoing.label), value: data?.ongoing.value },
      { label: translate(data?.canceled.label), value: data?.canceled.value },
    ];

    newChartSeries = newChartData.map((i) => i.value!);
    newChartLabels = newChartData.map((i) => translate(i.label));
  }

  const chartOptions: ApexOptions = {
    colors: ['#0E8478', '#FF4842', '#FFC107', '#13B2A2'],
    labels: newChartLabels,
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
        startAngle: 0,
        expandOnClick: false,
        donut: {
          size: '90%',
        },
        dataLabels: {
          offset: 1,
          minAngleToShowLabel: 0.5,
        },
      },
    },
  };

  return (
    <>
      <Typography variant="h4" gutterBottom sx={{ fontFamily: 'Cairo', fontStyle: 'Bold' }}>
        {headline}
      </Typography>
      <ChartWrapperStyle>
        <ReactApexChart type="donut" series={newChartSeries} options={chartOptions} height={200} />
      </ChartWrapperStyle>
    </>
  );
}

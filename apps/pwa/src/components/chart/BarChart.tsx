import { Box, Typography } from '@mui/material';
import { ApexOptions } from 'apexcharts';
import Chart from 'react-apexcharts';
import useLocales from '../../hooks/useLocales';
import { IBarCartProps } from './types';

export default function BarChart({
  data,
  headline,
  customApexChartOptions,
  customBarColors,
  xAxisDatas,
  legendPosition,
  barRenderOptions,
  chartBarWidth,
  chartBarHeight,
  barRenderHorizontal,
  barRenderColumnWidth,
  barRenderBorderRadius,
}: IBarCartProps) {
  const { translate } = useLocales();
  const defaultSeries: ApexAxisChartSeries | ApexNonAxisChartSeries = [
    {
      name: 'Last Month',
      data: [10, 13, 25, 23],
    },
    {
      name: 'This Month',
      data: [13, 33, 15, 18],
    },
  ];

  var options: ApexOptions = {
    chart: customApexChartOptions ?? {
      type: 'bar',
      height: !customApexChartOptions && chartBarHeight ? chartBarHeight : 350,
      width: !customApexChartOptions && chartBarWidth ? chartBarWidth : '100%',
    },
    plotOptions: barRenderOptions ?? {
      bar: {
        horizontal: !barRenderOptions && barRenderHorizontal ? barRenderHorizontal : false,
        columnWidth: !barRenderOptions && barRenderColumnWidth ? barRenderColumnWidth : '45%',
        borderRadius: !barRenderOptions && barRenderBorderRadius ? barRenderBorderRadius : 30,
      },
    },
    dataLabels: {
      enabled: false,
    },
    colors: customBarColors ?? (data && data.length === 1) ? ['#0E8478'] : ['#1E1E1E', '#0E8478'],
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: xAxisDatas ?? [
        'default data 1',
        'default data 2',
        'default data 3',
        'default data 4',
      ],
    },
    fill: {
      opacity: 1,
    },
    legend: {
      position: legendPosition ?? 'top',
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return '$ ' + val + ' thousands';
        },
      },
    },
  };

  return (
    <Box>
      <Typography variant="h3" sx={{ padding: '10px' }}>
        {translate(headline)}
      </Typography>
      <Chart options={options} series={data ?? defaultSeries} type="bar" />
    </Box>
  );
}

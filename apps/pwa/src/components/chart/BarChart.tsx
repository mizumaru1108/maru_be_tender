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

  const xAxisDatasTranslate = xAxisDatas?.map((v) => translate(v));

  const dataTranslate = data?.map((v: any) => ({
    name: translate(v.name),
    data: v.data,
  }));

  var options: ApexOptions = {
    chart: {
      type: 'bar',
      // height: 400,
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
    colors: customBarColors ?? (data && data.length === 1) ? ['#0E8478'] : ['#0E8478', '#FF4842'],
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: xAxisDatasTranslate ?? [
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
          return `${val}`;
        },
      },
    },
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ padding: '10px' }}>
        {translate(headline)}
      </Typography>
      <Chart options={options} series={dataTranslate} type="bar" height={400} />
    </Box>
  );
}

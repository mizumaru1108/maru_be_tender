import { Box, Typography } from '@mui/material';
import { ApexOptions } from 'apexcharts';
import Chart from 'react-apexcharts';
import useLocales from '../../hooks/useLocales';
import { IBarCartProps } from './types';
import EnLocale from 'apexcharts/dist/locales/en.json';
import ArLocale from 'apexcharts/dist/locales/ar.json';

interface CustomApexOptions extends ApexOptions {
  chart?: Partial<ApexOptions['chart']> & {
    menu?: {
      width?: number;
      padding?: {
        top?: number;
        right?: number;
        bottom?: number;
        left?: number;
      };
    };
  };
}

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
  const { translate, currentLang } = useLocales();

  const xAxisDatasTranslate = xAxisDatas?.map((v) => translate(v));

  const dataTranslate = data?.map((v: any) => ({
    name: translate(v.name),
    data: v.data,
  }));

  var options: CustomApexOptions = {
    chart: {
      locales: currentLang.value === 'en' ? [EnLocale] : [ArLocale],
      defaultLocale: currentLang.value === 'en' ? 'en' : 'ar',
      type: 'bar',
      // height: 400,
      width: !customApexChartOptions && chartBarWidth ? chartBarWidth : '100%',
      toolbar: {
        show: true,
        tools: {
          download: true,
        },
      },
      menu: {
        width: 200,
        padding: {
          top: 6,
          right: 6,
          bottom: 6,
          left: 6,
        },
      },
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

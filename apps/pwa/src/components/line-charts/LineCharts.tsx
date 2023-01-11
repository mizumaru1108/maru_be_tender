import { useState, useEffect } from 'react';
import ReactApexChart from 'react-apexcharts';
import { merge } from 'lodash';
// material | component
import { useTheme } from '@mui/material';
import BaseOptionChart from 'components/chart/BaseOptionChart';
//
import { ILineCharts } from './LineCharts.types';
import useLocales from 'hooks/useLocales';

const LineCharts = ({ series_data, color }: ILineCharts) => {
  const { translate } = useLocales();
  const theme = useTheme();
  const [valueColor, setValueColor] = useState<string>('');
  const [valueSeries, setValueSeries] = useState<ApexAxisChartSeries | ApexNonAxisChartSeries | []>(
    []
  );

  const chartOptions = merge(BaseOptionChart(), {
    colors: [
      function () {
        if (valueColor === 'up') {
          return '#0E8478';
        } else if (valueColor === 'stable') {
          return '#FFC107';
        } else if (valueColor === 'down') {
          return '#FF4842';
        } else {
          return '#161C24';
        }
      },
    ],
    grid: {
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: false,
        },
      },
    },
    xaxis: {
      categories: ['', ''],
    },
    yaxis: {
      show: false,
    },
    tooltip: {
      marker: {
        show: false,
      },
    },
  });

  useEffect(() => {
    setValueColor(color!);
    setValueSeries(series_data!);
  }, [series_data, color]);

  return (
    <>
      <ReactApexChart type="line" series={valueSeries} options={chartOptions} height="140" />
    </>
  );
};

export default LineCharts;

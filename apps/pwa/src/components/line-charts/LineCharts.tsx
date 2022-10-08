import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { merge } from 'lodash';
// material | component
import { Box, Typography, Card, Stack, useTheme, Grid } from '@mui/material';
import BaseOptionChart from 'components/chart/BaseOptionChart';
import Label from 'components/Label';
import Iconify from 'components/Iconify';
//
import { ILineCharts } from './LineCharts.types';

const LineCharts = ({
  lineChartData,
  seriesData,
  categories,
  height,
  title,
  subtitle,
  type,
  compareValue,
  color,
  icon,
}: ILineCharts) => {
  const theme = useTheme();
  const chartOptions = merge(BaseOptionChart(), {
    colors: [
      function () {
        if (color === 'up') {
          return '#0E8478';
        } else if (color === 'stable') {
          return '#FFC107';
        } else if (color === 'down') {
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
      categories,
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

  return (
    <Card sx={{ bgcolor: 'white', p: lineChartData ? 2 : 3 }}>
      <Stack
        spacing={1}
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        component="div"
      >
        {typeof lineChartData === 'object' && (
          <Grid item xs={lineChartData ? 6 : 12}>
            {lineChartData?.map((item) => (
              <Box key={item.year} sx={{ width: '100%' }}>
                {item.year === seriesData && (
                  <ReactApexChart
                    type="line"
                    series={item.data}
                    options={chartOptions}
                    height={height}
                  />
                )}
              </Box>
            ))}
          </Grid>
        )}
        <Grid item xs={lineChartData ? 6 : 12}>
          <Stack component="div" spacing={1} sx={{ textAlign: lineChartData ? 'right' : 'left' }}>
            {title && <Typography variant="h6">{title}</Typography>}
            {icon && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: lineChartData ? 'flex-end' : 'flex-start',
                }}
              >
                <img src="/assets/icons/currency-icon.svg" alt="currency-icon" />
              </Box>
            )}
            {subtitle && (
              <Typography variant="subtitle2" sx={{ color: theme.palette.grey[500] }}>
                {subtitle}
              </Typography>
            )}
            {type && (
              <Typography variant="h4" component="p" sx={{ color: theme.palette.primary.main }}>
                {type?.value} {type?.label}
              </Typography>
            )}
            {compareValue && (
              <Box>
                <Label
                  color={
                    (color === 'up' && 'primary') ||
                    (color === 'stable' && 'warning') ||
                    (color === 'down' && 'error') ||
                    'default'
                  }
                  sx={{ mr: 1 }}
                >
                  {compareValue} {type?.label}
                </Label>
                <Typography variant="caption" sx={{ color: theme.palette.grey[500] }}>
                  Since last month
                </Typography>
              </Box>
            )}
          </Stack>
        </Grid>
      </Stack>
    </Card>
  );
};

export default LineCharts;
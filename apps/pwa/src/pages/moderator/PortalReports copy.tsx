import { Box, Button, Grid, Typography } from '@mui/material';
import Chart from 'react-apexcharts';
import React from 'react';
import { ApexOptions } from 'apexcharts';
import { fNumber } from '../../utils/formatNumber';

function PortalReports() {
  const series = [40, 14, 20, 25];

  const options: ApexOptions = {
    colors: ['#0E8478', '#13B2A2', '#FF4842', '#FFC107'],
    labels: ['Partner need to active', 'Active partner', 'Rejected partner', 'Pending partner'],
    legend: {
      show: false,
      formatter(legendName, opts?) {
        return `${legendName} - ${fNumber(opts.w.globals.series[opts.seriesIndex])}`;
      },
    },
    dataLabels: {
      enabled: false,
      formatter: (val: number) => fNumber(val),
    },
    plotOptions: {
      pie: {
        expandOnClick: false,
        donut: {
          size: '90%',
        },
      },
    },
  };

  return (
    <>
      <Typography variant="h3" sx={{ marginBottom: 2 }}>
        {' '}
        Depending on the partner's condition{' '}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={6} md={6}>
          <Chart options={options} type="donut" series={series} width="200" height="200" />
        </Grid>
        <Grid container>
          <Grid item xs={3} md={3}>
            <Button variant="contained" sx={{ width: '100%' }}>
              test
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Typography sx={{ marginBottom: 2 }}> Depending on the partner's condition </Typography>
    </>
  );
}

export default PortalReports;

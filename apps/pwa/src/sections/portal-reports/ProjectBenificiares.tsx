import merge from 'lodash/merge';
import ReactApexChart from 'react-apexcharts';
// @mui
import { useTheme, styled } from '@mui/material/styles';
import { Box, CardProps, Card, Stack, Typography } from '@mui/material';
import useResponsive from 'hooks/useResponsive';
import { BaseOptionChart } from 'components/chart';
// hooks
import useLocales from 'hooks/useLocales';
// components

// ----------------------------------------------------------------------

const RootStyle = styled(Card)(({ theme }) => ({
  '& .apexcharts-legend': {
    width: 240,
    margin: 'auto',
    [theme.breakpoints.up('sm')]: {
      flexWrap: 'wrap',
      height: 160,
      width: '50%',
    },
  },
  '& .apexcharts-datalabels-group': {
    display: 'none',
  },
}));

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  chartColors: string[];
  chartData: {
    label: string;
    value: number;
  }[];
}

export default function ProjectBenificiares({
  title,
  subheader,
  chartColors,
  chartData,
  ...other
}: Props) {
  const theme = useTheme();
  const { translate } = useLocales();

  const isDesktop = useResponsive('up', 'sm');

  const chartLabels = chartData.map((i) => translate(i.label));

  const chartSeries = chartData.map((i) => i.value);

  const chartOptions = merge(BaseOptionChart(), {
    labels: chartLabels,
    colors: chartColors,
    stroke: {
      colors: [theme.palette.background.paper],
    },
    yaxis: {
      show: true,
      logBase: 10,
      tickAmount: 6,
      labels: {
        formatter: (val: number) => val.toFixed(0),
      },
      min: 0,
    },
    fill: { opacity: 0.8 },
    legend: {
      position: 'right',
      itemMargin: {
        horizontal: 10,
        vertical: 5,
      },
    },
    responsive: [
      {
        breakpoint: theme.breakpoints.values.sm,
        options: {
          legend: {
            position: 'bottom',
            horizontalAlign: 'left',
          },
        },
      },
    ],
  });

  return (
    <Stack direction="column">
      <Typography variant="h4">{title}</Typography>
      <Box sx={{ my: 5 }} dir="ltr">
        <ReactApexChart
          type="polarArea"
          series={chartSeries}
          options={chartOptions}
          height={isDesktop ? 240 : 360}
        />
      </Box>
    </Stack>
  );
}

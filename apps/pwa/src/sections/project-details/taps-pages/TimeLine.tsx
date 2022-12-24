import { styled, useTheme } from '@mui/material/styles';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

const ChartWrapperStyle = styled('div')(({ theme }) => ({
  marginTop: theme.spacing(5),
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
}));

function TimeLine() {
  const state = {
    series: [
      {
        data: [
          {
            x: 'البند الأول',
            y: [new Date('2019-03-20').getTime(), new Date('2019-03-23').getTime()],
          },
          {
            x: 'البند الثاني',
            y: [new Date('2019-03-24').getTime(), new Date('2019-03-27').getTime()],
          },
          {
            x: 'البند الثالث',
            y: [new Date('2019-03-24').getTime(), new Date('2019-03-27').getTime()],
          },
          {
            x: 'البند الرابع',
            y: [new Date('2019-03-27').getTime(), new Date('2019-04-03').getTime()],
          },
          {
            x: 'البند الخامس',
            y: [new Date('2019-04-03').getTime(), new Date('2019-04-09').getTime()],
          },
        ],
      },
    ],
    options: {
      chart: {
        height: 350,
        type: 'rangeBar',
        toolbar: {
          show: false,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true,
            // customIcons: [
            //   {
            //     icon: '<div style="width="20"; background-color: #93A3B029">test1</div>',
            //     index: 0,
            //     title: 'tooltip of the icon',
            //     class: 'custom-icon',
            //     click: function (chart, options, e) {
            //       console.log('clicked custom-icon');
            //     },
            //   },
            //   {
            //     icon: '<div style="width="20"; background-color: #93A3B029">test2</div>',
            //     index: 1,
            //     title: 'tooltip of the icon',
            //     class: 'custom-icon',
            //     click: function (chart, options, e) {
            //       console.log('clicked custom-icon');
            //     },
            //   },
            // ],
            // customIcons: [
            //   {
            //     icon: "<img src='/assets/icons/flags/ic_flag_en.svg' width='20'>",
            //     index: 4,
            //     title: 'tooltip of the icon',
            //     class: 'custom-icon',
            //     click: function (chart, options, e) {
            //       console.log('clicked custom-icon');
            //     },
            //   },
            // ],
          },
        },
      },
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (val: any, opts: any) {
          return opts.w.globals.labels[opts.dataPointIndex];
        },
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: 'vertical',
          shadeIntensity: 0.25,
          gradientToColors: undefined,
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [50, 0, 100, 100],
        },
      },
      xaxis: {
        type: 'datetime',
      },
      legend: {
        position: 'top',
      },
    } as ApexOptions,
  };
  return (
    <div id="chart" dir="ltr">
      <ReactApexChart options={state.options} series={state.series} type="rangeBar" height={350} />
    </div>
  );
}

export default TimeLine;

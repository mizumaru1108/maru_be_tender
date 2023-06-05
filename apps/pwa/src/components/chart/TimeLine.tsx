import { styled, useTheme } from '@mui/material/styles';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

type ITimeLine = {
  name: string;
  start_date: string;
  end_date: string;
};
interface Props {
  projectTimeLine: ITimeLine[];
}

function TimeLine({ projectTimeLine }: Props) {
  // console.log({ projectTimeLine });
  const state = {
    series: [
      {
        data: projectTimeLine.map((item) => ({
          x: item.name,
          y: [new Date(item.start_date).getTime(), new Date(item.end_date).getTime()],
          fillColor: '#0E8478',
        })),
      },
    ],
    options: {
      chart: {
        height: 350,
        type: 'rangeBar',
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: true,
            zoom: true,
            zoomin: true,
            zoomout: true,
            pan: true,
            reset: true,
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
      // fill: {
      //   type: 'gradient',
      //   gradient: {
      //     shade: 'light',
      //     type: 'vertical',
      //     shadeIntensity: 0.25,
      //     gradientToColors: undefined,
      //     inverseColors: true,
      //     opacityFrom: 1,
      //     opacityTo: 1,
      //     stops: [50, 0, 100, 100],
      //   },
      // },
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

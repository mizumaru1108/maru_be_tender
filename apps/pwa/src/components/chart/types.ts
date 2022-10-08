import { ApexOptions } from 'apexcharts';

export interface IBaseChartProps {
  customApexChartOptions?: ApexChart; // See https://apexcharts.com/docs/options/chart/
}

export interface IBarCartProps extends IBaseChartProps {
  data: ApexAxisChartSeries | ApexNonAxisChartSeries;
  headline?: string;
  customBarColors?: ApexOptions['colors'];
  xAxisDatas?: string[];
  legendPosition?: 'top' | 'right' | 'bottom' | 'left';
  barRenderOptions?: ApexPlotOptions; // See https://apexcharts.com/docs/options/plotoptions/bar/
  barRenderHorizontal?: boolean;
  barRenderColumnWidth?: string;
  barRenderBorderRadius?: number | number[];
  chartBarHeight?: number | string;
  chartBarWidth?: number | string;
}

interface ValueChartDonut {
  label: string;
  value: number;
}
interface IDataChart {
  accepted: ValueChartDonut;
  processing: ValueChartDonut;
  pending: ValueChartDonut;
  rejected: ValueChartDonut;
}
export interface IDonatChartProps {
  data: IDataChart;
  type: 'projects' | 'accounts';
  headLine: string;
}
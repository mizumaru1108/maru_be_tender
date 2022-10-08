export interface ILineCharts {
  showLineChart?: boolean;
  lineChartData?: {
    year: number;
    data: {
      name: string;
      data: number[];
    }[];
  }[];
  title?: string;
  subtitle?: string;
  icon?: boolean | false;
  type?: {
    label?: string;
    value?: string;
  };
  compareValue?: string;
  seriesData?: number;
  categories?: string[];
  height?: string;
  color?: string;
}

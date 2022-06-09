export class ChartDetailData {
  name: string;
  data: number[];
}

export class ChartDataDto {
  name: string;
  value: string;
  data: ChartDetailData[];
  categories: string[];
}

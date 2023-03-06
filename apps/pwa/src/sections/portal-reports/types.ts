export interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}

export interface IPropsHeaderTabs {
  key: string;
  data:
    | {
        key: string;
        data: any[];
      }[]
    | [];
}

/**
 * types for project info tab
 */

export interface IPropsProjectInfo {
  dataList: IPropsHeaderTabs[] | null;
  dataBeneficiaries: IPolarBeneficiaries | null;
  submitting: boolean;
}

export interface IBaseLabelValue {
  label: string;
  value: number;
}

export interface IDonutDataTracks {
  key: string;
  ongoing: IBaseLabelValue;
  canceled: IBaseLabelValue;
}

export interface IBarAuthorities {
  name: string;
  data: number[];
}

export interface IDataMapItems {
  [track: string]: {
    ONGOING: number;
    CANCELED: number;
  };
}

export interface IMapItemKeys {
  key: string;
  data: IDataMapItems[];
}

export interface IResultMapItems {
  label: string;
  ongoing: number;
  canceled: number;
}

export interface IBenTracks {
  track: string;
  total_project_beneficiaries: number;
}

export interface IBenTypes {
  type: string;
  total_project_beneficiaries: number;
}

export interface IPolarBeneficiaries {
  by_track: IBenTracks[];
  by_type: IBenTypes[];
}

/**
 * types for partners tab
 */

export interface IBaseCountValue {
  label: string;
  value:
    | number
    | {
        label: string;
        value: number;
        total?: number;
      }[]
    | [];
  total?: number;
}

export interface IPartnerDatas {
  by_status: IBaseCountValue[] | [];
  by_region: IBaseCountValue[] | [];
  by_governorate: IBaseCountValue[] | [];
  monthlyData: {
    this_month: IBaseCountValue[] | [];
    last_month: IBaseCountValue[] | [];
  };
}

export interface IPropsPartnerInfo {
  partner_data: IPartnerDatas | null;
  submitting: boolean;
}

/**
 * types for budget info tab
 */

export interface IPropsBudgetInfo {
  project_track: string;
  total_budget: number;
  spended_budget: number;
  spended_budget_last_week: number;
  reserved_budget: number;
  reserved_budget_last_week: number;
}

/**
 * types for average transaction tab
 */

export interface IPropsLineChart {
  color?: string;
  series_data?: ApexAxisChartSeries | ApexNonAxisChartSeries;
}

export interface IPropsAvgTransactions {
  project_track: string;
  raw_total_response_time: number;
  total_response_time: string;
  raw_average_response_time: number;
  average_response_time: string;
  fe_average_response_time?: {
    hours: number;
    minutes: number;
    seconds: number;
  };
  raw_last_month_total_response_time: number;
  last_month_total_response_time: string;
  raw_last_month_average_response_time: number;
  last_month_average_response_time: string;
  color?: string;
  series_data?: ApexAxisChartSeries | ApexNonAxisChartSeries;
}

export interface IPropsAvgEmployeeEfectiveness {
  id: string | null;
  employee_name: string | null;
  account_type: string | null;
  section: string | null;
  total_transaction: number;
  raw_response_time: number;
  response_time: string | null;
  raw_average_response_time: number;
  average_response_time: string | null;
}

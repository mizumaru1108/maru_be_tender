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

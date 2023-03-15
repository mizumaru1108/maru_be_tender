import { FileProp } from 'components/upload';

export interface IPropFromProjectReport {
  children?: React.ReactNode;
  onSubmit: (data: any) => void;
  defaultValues: CloseReportForm;
  isEdit?: boolean;
  loading?: boolean;
}

export interface CloseReportForm {
  proposal_id: string;
  number_of_beneficiaries: number;
  target_beneficiaries: string;
  execution_place: string;
  gender: string | undefined;
  project_duration: string;
  project_repeated: string;
  number_of_volunteer: number;
  number_of_staff: number;
  attacments: FileProp | FileProp[] | any;
  images: FileProp | FileProp[] | any;
}

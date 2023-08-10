import { FileProp } from 'components/upload';

export interface IPropFromProjectReport {
  children?: React.ReactNode;
  onSubmit: (data: any) => void;
  defaultValues: CloseReportForm;
  isEdit?: boolean;
  loading?: boolean;
}
interface MultiFieldClosingForm {
  selected_values: string;
  selected_numbers: number;
}

export interface CloseReportForm {
  proposal_id: string;
  number_of_beneficiaries: number;
  target_beneficiaries?: string;
  execution_place?: string;
  gender?: string | undefined;
  project_duration: string;
  number_project_duration: number;
  project_repeated: string;
  number_project_repeated: number;
  number_of_volunteer: number;
  number_of_staff: number;
  attachments: FileProp | FileProp[] | any;
  images: FileProp | FileProp[] | any;
  genders?: MultiFieldClosingForm[];
  execution_places?: MultiFieldClosingForm[];
  beneficiaries?: MultiFieldClosingForm[];
}

export interface ClosingReportData {
  id: string | null;
  proposal_id: string | null;
  beneficiaries?: {
    closing_report_id: string;
    id: string;
    selected_numbers: number;
    selected_values: string;
  }[];
  genders?: {
    closing_report_id: string;
    id: string;
    selected_numbers: number;
    selected_values: string;
  }[];
  execution_places?: {
    closing_report_id: string;
    id: string;
    selected_numbers: number;
    selected_values: string;
  }[];
  attachments:
    | {
        url?: string | '' | null;
        size?: number | undefined;
        type?: string;
        base64Data?: string;
        fullName?: string;
        fileExtension?: string;
        color?: string;
      }[]
    | [];
  created_at: string | Date | null;
  updated_at: string | Date | null;
  execution_place: string | null;
  gender: string | null;
  images:
    | {
        url?: string | '' | null;
        size?: number | undefined;
        type?: string;
        base64Data?: string;
        fullName?: string;
        fileExtension?: string;
        color?: string;
      }[]
    | [];
  number_of_beneficiaries: number;
  number_of_staff: number;
  number_of_volunteer: number;
  number_project_duration: number;
  number_project_repeated: number;
  project_duration: string | null;
  project_repeated: string | null;
  target_beneficiaries: string | null;
}

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
  attachments: FileProp | FileProp[] | any;
  images: FileProp | FileProp[] | any;
}

export interface ClosingReportData {
  id: string | null;
  proposal_id: string | null;
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
  project_duration: string | null;
  project_repeated: string | null;
  target_beneficiaries: string | null;
}

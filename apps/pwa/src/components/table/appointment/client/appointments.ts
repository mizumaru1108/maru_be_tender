import { BasePaginateResponse } from '../../../../@types/commons';

export interface Appointments extends BasePaginateResponse {
  id: string;
  meetingId: string;
  meetingTime: string;
  employee: string;
  appointmentLink: string;
}

export interface AppointmentsTableHeader {
  id: string;
  label: string;
  align?: 'left' | 'right' | 'center';
}

export interface AppointmentsTableColumn {
  row: Appointments;
  isRequest: boolean;
  // selected?: boolean;
  // onSelectRow?: VoidFunction;
  // destination?: string;
}

export interface AppointmentsManagementTableProps {
  data: Appointments[];
  headerCell: AppointmentsTableHeader[];
  headline?: string;
  isLoading?: boolean;
  isRequest?: boolean;
  onReject?: (data: any) => void;
  onAccept?: (id: string) => void;
}

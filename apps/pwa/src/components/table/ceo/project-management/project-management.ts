import { BasePaginateResponse } from '../../../../@types/commons';

export interface ProjectManagement extends BasePaginateResponse {
  id: string;
  projectNumber?: string;
  projectName?: string;
  associationName?: string;
  projectSection?: string;
  createdAt?: Date | string;
  projectDelay?: Date | string;
}

export interface ProjectManagementTableHeader {
  id: string;
  label: string;
  align?: 'left' | 'right' | 'center';
}

export interface ProjectManagementTableColumn {
  row: ProjectManagement;
  selected?: boolean;
  onSelectRow?: VoidFunction;
  destination?: string;
}

export interface ProjectManagementTableProps {
  data: ProjectManagement[];
  headerCell: ProjectManagementTableHeader[];
  headline?: string;
  isLoading?: boolean;
  onFilterChange?: (filter: any) => void;
  onSortChange?: (sort: any) => void;
  onSortMethodChange?: (sortMethod: any) => void;
}

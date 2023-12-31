import { BasePaginateResponse } from '../../../../@types/commons';
import { ProjectManagementFilterParams } from '../../../../sections/ceo/ceo-dashboard/ProjectManagement';

export interface ProjectManagement extends BasePaginateResponse {
  id: string;
  projectNumber?: string;
  projectName?: string;
  associationName?: string;
  projectSection?: string;
  createdAt?: Date | string;
  projectDelay?: Date | string;
  userId?: string;
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
  destinationRole?: string;
  needSelection?: boolean;
}

export interface ProjectManagementTableProps {
  data: ProjectManagement[];
  headerCell: ProjectManagementTableHeader[];
  headline?: string;
  isLoading?: boolean;
  destination?: string;
  destinationRole?: string;
  onFilterChange?: (filter: any) => void;
  onSortChange?: (sort: any) => void;
  onSortMethodChange?: (sortMethod: any) => void;
}

type filter = 'track_id' | 'none' | 'project_number' | 'project_name' | 'project_section';
type TCeoTable = 'show-details' | 'reject-project';
export interface ProjectManagementTableBEProps {
  data: ProjectManagement[];
  headerCell: ProjectManagementTableHeader[];
  headline?: string;
  isLoading?: boolean;
  total: number;
  table_type?: TCeoTable;
  filterparams: ProjectManagementFilterParams;
  onPageChange: (page: number) => void;
  onChangeRowsPage: (rowsPerPage: number) => void;
  onFilterChange: React.Dispatch<React.SetStateAction<ProjectManagementFilterParams>>;
  onSearch?: (value: string) => void;
  reFetch?: () => void;
}

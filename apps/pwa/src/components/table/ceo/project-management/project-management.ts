export interface ProjectManagement {
  id: string;
  projectNumber: string;
  projectName: string;
  associationName: string;
  projectSection: string;
  createdAt: Date;
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
}

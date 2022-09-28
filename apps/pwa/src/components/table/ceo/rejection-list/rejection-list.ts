export interface RejectionList {
  id: string;
  projectNumber: string;
  projectName: string;
  associationName: string;
  projectSection: string;
  createdAt: Date;
}

export interface RejectionListTableHeader {
  id: string;
  label: string;
  align?: 'left' | 'right' | 'center';
}

export interface RejectionListTableColumn {
  row: RejectionList;
  selected?: boolean;
  onSelectRow?: VoidFunction;
  destination?: string;
}

export interface RejectionListTableProps {
  data: RejectionList[];
  headerCell: RejectionListTableHeader[];
}

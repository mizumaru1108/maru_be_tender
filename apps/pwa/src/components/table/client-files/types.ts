export type ClientFiles = {
  id: string;
  file_name: string;
  section_name?: string | null;
  type: string;
  link: string;
};

export interface CLientListRow {
  row: ClientFiles;
  selected?: boolean;
  onSelectRow?: VoidFunction;
}

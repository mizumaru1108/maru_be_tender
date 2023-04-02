export type RejectedProjects = {
  id: string;
  project_name: string;
  entity: string;
  project_track: string;
  created_at: Date;
  project_number?: string;
};

export interface RejectedProjectsRow {
  row: RejectedProjects;
  selected?: boolean;
  onSelectRow?: VoidFunction;
}

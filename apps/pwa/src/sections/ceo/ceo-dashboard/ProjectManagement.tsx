import {
  ProjectManagement,
  ProjectManagementTableHeader,
} from '../../../components/table/ceo/project-management/project-management';

import ProjectManagementTable from '../../../components/table/ceo/project-management/ProjectManagementTable';

import { useEffect, useState } from 'react';
import { useQuery } from 'urql';
import { GetProjectList } from '../../../queries/ceo/get-project-list';

function DashboardProjectManagement() {
  const [projectManagementData, setProjectManagementData] = useState<ProjectManagement[]>([]);

  const [projectList, fetchProject] = useQuery({
    query: GetProjectList,
  });

  const { data: projectDatas, fetching, error } = projectList;

  if (error) {
    console.log(error);
  }

  useEffect(() => {
    if (projectDatas) {
      setProjectManagementData(projectDatas.proposal);
    }
    console.log(projectDatas);
  }, [projectDatas]);

  const headerCells: ProjectManagementTableHeader[] = [
    { id: 'projectNumber', label: 'Project Number' },
    { id: 'projectName', label: 'Project Name' },
    { id: 'associationName', label: 'Association Name', align: 'left' },
    { id: 'projectSection', label: 'Section', align: 'left' },
    { id: 'createdAt', label: 'Date Created', align: 'left' },
    { id: 'events', label: 'events', align: 'left' },
  ];

  return (
    <ProjectManagementTable
      headline="Project Management"
      isLoading={fetching}
      headerCell={headerCells}
      data={projectManagementData ?? []}
    />
  );
}

export default DashboardProjectManagement;

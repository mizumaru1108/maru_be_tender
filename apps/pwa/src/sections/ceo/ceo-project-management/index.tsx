import { useEffect, useState } from 'react';
import { useQuery } from 'urql';
import {
  ProjectManagement,
  ProjectManagementTableHeader,
} from '../../../components/table/ceo/project-management/project-management';
import ProjectManagementTable from '../../../components/table/ceo/project-management/ProjectManagementTable';
import useLocales from '../../../hooks/useLocales';
import { GetProjectList } from '../../../queries/ceo/get-project-list';

function CeoProjectManagement() {
  const { translate } = useLocales();
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
  }, [projectDatas]);

  const headerCells: ProjectManagementTableHeader[] = [
    { id: 'projectNumber', label: translate('project_management_headercell.project_number') },
    { id: 'projectName', label: translate('project_management_headercell.project_name') },
    {
      id: 'associationName',
      label: translate('project_management_headercell.association_name'),
      align: 'left',
    },
    {
      id: 'projectSection',
      label: translate('project_management_headercell.section'),
      align: 'left',
    },
    {
      id: 'createdAt',
      label: translate('project_management_headercell.date_created'),
      align: 'left',
    },
    { id: 'events', label: translate('project_management_headercell.events'), align: 'left' },
  ];

  return (
    <ProjectManagementTable
      headline={translate('project_management_table.headline')}
      isLoading={fetching}
      headerCell={headerCells}
      data={projectManagementData ?? []}
    />
  );
}

export default CeoProjectManagement;

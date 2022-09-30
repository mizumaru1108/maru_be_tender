import {
  ProjectManagement,
  ProjectManagementTableHeader,
} from '../../../components/table/ceo/project-management/project-management';

import ProjectManagementTable from '../../../components/table/ceo/project-management/ProjectManagementTable';

import { HASURA_GRAPHQL_URL, HASURA_ADMIN_SECRET } from 'config';
import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';

function DashboardProjectManagement() {
  const path = HASURA_GRAPHQL_URL;
  const secret = HASURA_ADMIN_SECRET;

  const [projectManagementData, setProjectManagementData] = useState<ProjectManagement[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchProjectList = useCallback(async (): Promise<ProjectManagement[] | null> => {
    const queryData = {
      query: `
        query GetProjectList {
          proposal(where: {state: {_eq: CEO}}, limit: 5) {
            projectNumber: id
            projectName: project_name
            projectSection: project_kind_id
            createdAt: created_at
          }
          proposal_aggregate(where: {state: {_eq: CEO}}, limit: 5) {
            aggregate {
              totalData: count
            }
          }
        }
      `,
    };

    const headers = {
      headers: {
        'Content-Type': 'aplication/json',
        'x-hasura-admin-secret': `${secret}`,
      },
    };

    setIsLoading(true);
    try {
      const response = await axios.post(`${path}`, queryData, headers);
      return response.data.data.proposal as ProjectManagement[];
    } catch (err) {
      console.log('Error:  ', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const initFetchProjectList = useCallback(async () => {
    const projects = await fetchProjectList();
    if (projects !== null && isLoading === false) {
      setProjectManagementData(projects);
    }
  }, [fetchProjectList]);

  useEffect(() => {
    initFetchProjectList();
  }, []);

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
      isLoading={isLoading}
      headerCell={headerCells}
      data={projectManagementData}
    />
  );
}

export default DashboardProjectManagement;

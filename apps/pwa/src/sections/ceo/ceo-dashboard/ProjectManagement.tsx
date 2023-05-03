import {
  ProjectManagement,
  ProjectManagementTableHeader,
} from '../../../components/table/ceo/project-management/project-management';
import { formatDistance } from 'date-fns';

import ProjectManagementTable from '../../../components/table/ceo/project-management/ProjectManagementTable';

import React, { useEffect, useState } from 'react';
import { useQuery } from 'urql';
import { GetProjectList } from '../../../queries/ceo/get-project-list';
import useLocales from '../../../hooks/useLocales';
import { useDispatch, useSelector } from 'redux/store';
import { setTracks } from 'redux/slices/proposal';
import { generateHeader } from '../../../utils/generateProposalNumber';
import { useSnackbar } from 'notistack';
import useAuth from '../../../hooks/useAuth';
import axiosInstance from '../../../utils/axios';
import { getDelayProjects } from '../../../utils/get-delay-projects';

function DashboardProjectManagement() {
  const { translate, currentLang } = useLocales();
  const dispatch = useDispatch();
  const { tracks } = useSelector((state) => state.proposal);
  const [projectManagementData, setProjectManagementData] = useState<ProjectManagement[]>([]);
  const [filteredTrack, setFilteredTrack] = useState([
    'MOSQUES',
    'CONCESSIONAL_GRANTS',
    'INITIATIVES',
    'BAPTISMS',
  ]);

  const [projectList, fetchProject] = useQuery({
    query: GetProjectList,
    variables: { track: tracks },
  });

  const { data: projectDatas, fetching, error } = projectList;

  const [isLoading, setIsLoading] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { activeRole } = useAuth();
  const [cardData, setCardData] = React.useState([]);

  const fetchingIncoming = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const rest = await axiosInstance.get(`tender-proposal/request-in-process?limit=0`, {
        headers: { 'x-hasura-role': activeRole! },
      });
      if (rest) {
        const tmpDatas = rest.data.data
          .filter((item: any) => item.state === 'CEO')
          .map((item: any) => ({
            ...item,
          }));
        if (tmpDatas) {
          setProjectManagementData(
            tmpDatas.map((project: any) => ({
              id: (project.id as string) || '',
              projectNumber:
                (generateHeader(
                  project && project.project_number ? project.project_number : project.id
                ) as string) || '',
              projectName: (project.project_name as string) || '',
              projectSection: project.project_track || '',
              associationName: (project.user.employee_name as string) || '',
              createdAt: (project.created_at as string) || '',
              projectDelay: getDelayProjects(project.created_at, currentLang.value) || '',
              userId: project.user.id || '',
            }))
          );
        }
      }
    } catch (err) {
      console.log('err', err);
      enqueueSnackbar(err.message, {
        variant: 'error',
        preventDuplicate: true,
        autoHideDuration: 3000,
        anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'center',
        },
      });
    } finally {
      setIsLoading(false);
    }
  }, [activeRole, enqueueSnackbar, currentLang]);

  if (error) {
    console.log(error);
  }

  // dispatch(setTracks(['MOSQUES', 'CONCESSIONAL_GRANTS', 'INITIATIVES', 'BAPTISMS']));

  // useEffect(() => {
  //   if (projectDatas) {
  //     setProjectManagementData(
  //       projectDatas.proposal.map((project: any) => ({
  //         id: (project.projectId as string) || '',
  //         projectNumber:
  //           (generateHeader(
  //             project && project.projectNumber && project.projectNumber
  //               ? project.projectNumber
  //               : project.projectId
  //           ) as string) || '',
  //         projectName: (project.projectName as string) || '',
  //         projectSection: project.projectSection || '',
  //         associationName: (project.associationName.client_data.entity as string) || '',
  //         createdAt: (project.createdAt as string) || '',
  //         projectDelay: getDelayProjects(project.createdAt) || '',
  //         userId: project.associationName.client_data.user_id || '',
  //       }))
  //     );
  //   }
  //   // eslint-disable-next-line
  // }, [projectDatas, currentLang]);

  React.useEffect(() => {
    fetchingIncoming();
  }, [fetchingIncoming]);

  useEffect(() => {
    dispatch(setTracks(filteredTrack));
  }, [dispatch, filteredTrack]);

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
    {
      id: 'projectDelay',
      label: translate('project_management_headercell.projects_delay'),
      align: 'left',
    },
    { id: 'events', label: translate('project_management_headercell.events'), align: 'left' },
  ];

  return (
    <>
      {!isLoading && (
        <ProjectManagementTable
          headline={translate('project_management_table.headline')}
          isLoading={fetching}
          headerCell={headerCells}
          data={projectManagementData ?? []}
        />
      )}
    </>
  );
}

export default DashboardProjectManagement;

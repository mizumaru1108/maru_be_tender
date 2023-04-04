import {
  ProjectManagement,
  ProjectManagementTableHeader,
} from '../../../components/table/ceo/project-management/project-management';
import { formatDistance } from 'date-fns';

import ProjectManagementTable from '../../../components/table/ceo/project-management/ProjectManagementTable';

import { useEffect, useState } from 'react';
import { useQuery } from 'urql';
import { GetProjectList } from '../../../queries/ceo/get-project-list';
import useLocales from '../../../hooks/useLocales';
import { useDispatch, useSelector } from 'redux/store';
import { setTracks } from 'redux/slices/proposal';
import { generateHeader } from '../../../utils/generateProposalNumber';

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

  if (error) {
    console.log(error);
  }

  // dispatch(setTracks(['MOSQUES', 'CONCESSIONAL_GRANTS', 'INITIATIVES', 'BAPTISMS']));

  function getDelayProjects(getDate: any) {
    const ignoredUnits = ['second', 'seconds', 'minute', 'minutes', 'hour', 'hours'];
    const createdAt = new Date(getDate);
    const formatter = new Intl.RelativeTimeFormat(currentLang.value);
    const formattedCreatedAt = formatDistance(createdAt, new Date(), {
      addSuffix: true,
    });

    const [value, unit] = formattedCreatedAt.split(' ');

    if (ignoredUnits.includes(unit)) {
      return null;
    }

    const parsedValue = parseInt(value);

    if (isNaN(parsedValue)) {
      return null;
    }

    const changeLangCreatedAt = formatter.format(-parsedValue, unit as Intl.RelativeTimeFormatUnit);
    const formattedCreatedAtLate = changeLangCreatedAt.replace(' ago', ' late');

    return formattedCreatedAtLate;
  }

  useEffect(() => {
    if (projectDatas) {
      setProjectManagementData(
        projectDatas.proposal.map((project: any) => ({
          id: (project.projectId as string) || '',
          projectNumber: (generateHeader(project.projectNumber) as string) || '',
          projectName: (project.projectName as string) || '',
          projectSection: project.projectSection || '',
          associationName: (project.associationName.client_data.entity as string) || '',
          createdAt: (project.createdAt as string) || '',
          projectDelay: getDelayProjects(project.createdAt) || '',
        }))
      );
    }
    // eslint-disable-next-line
  }, [projectDatas, currentLang]);

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
    <ProjectManagementTable
      headline={translate('project_management_table.headline')}
      isLoading={fetching}
      headerCell={headerCells}
      data={projectManagementData ?? []}
    />
  );
}

export default DashboardProjectManagement;

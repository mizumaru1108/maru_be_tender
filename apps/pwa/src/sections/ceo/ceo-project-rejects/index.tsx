import React, { useEffect, useState } from 'react';
import { useQuery } from 'urql';
import {
  ProjectManagement,
  ProjectManagementTableHeader,
} from '../../../components/table/ceo/project-management/project-management';
import ProjectManagementTable from '../../../components/table/ceo/project-management/ProjectManagementTable';
import useLocales from '../../../hooks/useLocales';
import { GetProjectList } from '../../../queries/ceo/get-project-list';
import { formatDistance } from 'date-fns';
import { useDispatch, useSelector } from 'redux/store';
import { getTrackList, setTracks } from 'redux/slices/proposal';
import { generateHeader } from '../../../utils/generateProposalNumber';
import { useSnackbar } from 'notistack';
import useAuth from '../../../hooks/useAuth';
import axiosInstance from '../../../utils/axios';
import { getDelayProjects } from '../../../utils/get-delay-projects';

export interface tracks {
  id: string;
  name: string;
  with_consultation: boolean;
}

function CeoProjectRejects() {
  const { translate, currentLang } = useLocales();
  const dispatch = useDispatch();
  const { tracks, isLoading, track_list } = useSelector((state) => state.proposal);
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

  //fetching using API

  const [isFetching, setIsLoading] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { activeRole } = useAuth();
  // const [cardData, setCardData] = React.useState([]);

  const fetchingIncoming = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const rest = await axiosInstance.get(`tender-proposal/rejection-list?limit=0`, {
        headers: { 'x-hasura-role': activeRole! },
      });
      if (rest) {
        const tmpDatas = rest.data.data.map((item: any) => ({
          ...item,
        }));
        if (tmpDatas) {
          // console.log('track_list', track_list);
          setProjectManagementData(
            tmpDatas.map((project: any) => ({
              id: (project.id as string) || '',
              projectNumber:
                (generateHeader(
                  project && project.project_number ? project.project_number : project.id
                ) as string) || '',
              projectName: (project.project_name as string) || '',
              // projectSection: project.project_track || '',
              projectSection:
                (project &&
                  project.track_id &&
                  track_list &&
                  track_list.length > 0 &&
                  track_list.find((item: tracks) => item.id === project.track_id)!.name) ||
                '',
              associationName: (project.user.employee_name as string) || '',
              createdAt: (project.created_at as string) || '',
              projectDelay: getDelayProjects(project.created_at, currentLang.value) || '',
              userId: project.user.id || '',
            }))
          );
        }
      }
    } catch (err) {
      // console.log('err', err);
      // enqueueSnackbar(err.message, {
      //   variant: 'error',
      //   preventDuplicate: true,
      //   autoHideDuration: 3000,
      //   anchorOrigin: {
      //     vertical: 'bottom',
      //     horizontal: 'center',
      //   },
      // });
      const statusCode = (err && err.statusCode) || 0;
      const message = (err && err.message) || null;
      enqueueSnackbar(
        `${
          statusCode < 500 && message ? message : translate('pages.common.internal_server_error')
        }`,
        {
          variant: 'error',
          preventDuplicate: true,
          autoHideDuration: 3000,
          anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
          },
        }
      );
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeRole, enqueueSnackbar, currentLang, track_list]);

  if (error) {
    console.log(error);
  }

  // dispatch(setTracks(['MOSQUES', 'CONCESSIONAL_GRANTS', 'INITIATIVES', 'BAPTISMS']));

  // function getDelayProjects(getDate: any) {
  //   const ignoredUnits = ['second', 'seconds', 'minute', 'minutes', 'hour', 'hours'];
  //   const createdAt = new Date(getDate);
  //   const formatter = new Intl.RelativeTimeFormat(currentLang.value);
  //   const formattedCreatedAt = formatDistance(createdAt, new Date(), {
  //     addSuffix: true,
  //   });

  //   const [value, unit] = formattedCreatedAt.split(' ');

  //   if (ignoredUnits.includes(unit)) {
  //     return null;
  //   }

  //   const parsedValue = parseInt(value);

  //   if (isNaN(parsedValue)) {
  //     return null;
  //   }

  //   const changeLangCreatedAt = formatter.format(-parsedValue, unit as Intl.RelativeTimeFormatUnit);
  //   const formattedCreatedAtLate = changeLangCreatedAt.replace(' ago', ' late');

  //   return formattedCreatedAtLate;
  // }

  // useEffect(() => {
  //   if (projectDatas) {
  //     setProjectManagementData(
  //       projectDatas.proposal.map((project: any) => ({
  //         id: (project.projectId as string) || '',
  //         // projectNumber: (project.projectNumber as string) || '',
  //         projectNumber:
  //           generateHeader(
  //             project && project.projectNumber && project.projectNumber
  //               ? project.projectNumber
  //               : project.projectId
  //           ) || '',
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
    if (track_list && !isLoading) {
      fetchingIncoming();
    }
    // fetchingPrevious();
  }, [fetchingIncoming, isLoading, track_list]);

  useEffect(() => {
    dispatch(setTracks(filteredTrack));
    dispatch(getTrackList(0, activeRole! as string));
  }, [dispatch, filteredTrack, activeRole]);

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

  if (isFetching && isLoading) return <>Loading</>;

  return (
    <ProjectManagementTable
      headline={translate('rejection_list_table.headline')}
      isLoading={fetching || isLoading}
      headerCell={headerCells}
      data={projectManagementData ?? []}
      destination={'reject-project'}
    />
  );
}

export default CeoProjectRejects;

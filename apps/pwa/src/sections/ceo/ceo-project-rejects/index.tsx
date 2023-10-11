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
import ProjectManagementTableBE from 'components/table/ceo/project-management/ProjectManagementTableBE';
import { REOPEN_TMRA_4601ec1d4d7e4d96ae17ecf65e2c2006 } from 'config';

export interface tracks {
  id: string;
  name: string;
  with_consultation: boolean;
  is_deleted?: boolean;
}

function CeoProjectRejects() {
  const { translate, currentLang } = useLocales();
  const dispatch = useDispatch();
  const { tracks, isLoading, track_list } = useSelector((state) => state.proposal);
  const [projectManagementData, setProjectManagementData] = useState<ProjectManagement[]>([]);
  // const [filteredTrack, setFilteredTrack] = useState([
  //   'MOSQUES',
  //   'CONCESSIONAL_GRANTS',
  //   'INITIATIVES',
  //   'BAPTISMS',
  // ]);

  // const [projectList, fetchProject] = useQuery({
  //   query: GetProjectList,
  //   variables: { track: tracks },
  // });

  // const { data: projectDatas, fetching, error } = projectList;

  //fetching using API

  const [isFetching, setIsLoading] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { activeRole } = useAuth();
  // const [cardData, setCardData] = React.useState([]);

  const [searchName, setSearchName] = useState('');

  // pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState<number | null>(null);
  const [filter, setFilter] = useState('');
  const [filterValue, setFilterValue] = useState('');

  const fetchingIncoming = React.useCallback(async () => {
    setIsLoading(true);
    let url = '';
    if (filter && filterValue && filterValue !== 'all') {
      url = `tender-proposal/rejection-list?limit=${limit}&page=${page}&${filter}=${filterValue}`;
    } else {
      url = `tender-proposal/rejection-list?limit=${limit}&page=${page}`;
    }
    if (searchName && REOPEN_TMRA_4601ec1d4d7e4d96ae17ecf65e2c2006) {
      url = `${url}&project_name=${searchName}`;
    }
    try {
      const rest = await axiosInstance.get(url, {
        headers: { 'x-hasura-role': activeRole! },
      });
      if (rest) {
        const tmpDatas = rest.data.data.map((item: any) => ({
          ...item,
        }));
        if (tmpDatas) {
          // console.log('track_list', track_list);
          setTotal(rest.data.total);
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
                  track_list.find((item: tracks) => item.id === project.track_id)?.name) ||
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
  }, [activeRole, enqueueSnackbar, currentLang, limit, page, filter, filterValue, searchName]);

  // if (error) {
  //   console.log(error);
  // }

  React.useEffect(() => {
    if (track_list && !isLoading) {
      fetchingIncoming();
    }
    // fetchingPrevious();
  }, [fetchingIncoming, isLoading, track_list]);

  useEffect(() => {
    // dispatch(setTracks(filteredTrack));
    dispatch(getTrackList(0, activeRole! as string, 0));
  }, [dispatch, activeRole]);

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
    // <ProjectManagementTable
    //   headline={translate('rejection_list_table.headline')}
    //   isLoading={fetching || isLoading}
    //   headerCell={headerCells}
    //   data={projectManagementData ?? []}
    //   destination={'reject-project'}
    // />
    <ProjectManagementTableBE
      data-cy="rejection-list-table"
      headline={translate('rejection_list_table.headline')}
      isLoading={isFetching}
      data={projectManagementData ?? []}
      headerCell={headerCells}
      total={total || 0}
      table_type={'reject-project'}
      onChangeRowsPage={(rowPage: number) => {
        setLimit(rowPage);
      }}
      onFilterChange={(filter, value) => {
        setFilter(filter);
        setFilterValue(value);
      }}
      onPageChange={(page: number) => {
        setPage(page);
      }}
      onSearch={(value) => {
        setSearchName(value);
      }}
      reFetch={() => {
        setSearchName('');
      }}
    />
  );
}

export default CeoProjectRejects;

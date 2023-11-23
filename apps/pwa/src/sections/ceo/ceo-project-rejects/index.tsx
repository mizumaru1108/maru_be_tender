import ProjectManagementTableBE from 'components/table/ceo/project-management/ProjectManagementTableBE';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { getTrackList } from 'redux/slices/proposal';
import { useDispatch, useSelector } from 'redux/store';
import { useQuery } from 'urql';
import {
  ProjectManagement,
  ProjectManagementTableHeader,
} from '../../../components/table/ceo/project-management/project-management';
import useAuth from '../../../hooks/useAuth';
import useLocales from '../../../hooks/useLocales';
import { getOneEmployee } from '../../../queries/admin/getAllTheEmployees';
import axiosInstance from '../../../utils/axios';
import { generateHeader } from '../../../utils/generateProposalNumber';
import { getDelayProjects } from '../../../utils/get-delay-projects';
import { ProjectManagementFilterParams } from '../ceo-dashboard/ProjectManagement';

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

  //fetching using API
  const [isFetching, setIsLoading] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { activeRole, user } = useAuth();
  // const [cardData, setCardData] = React.useState([]);

  const [searchName, setSearchName] = useState('');

  // pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState<number | null>(null);
  const [filterParams, setFilterParams] = useState<ProjectManagementFilterParams>({
    range_start_date: null,
    range_end_date: null,
    track_id: null,
  });

  const [result] = useQuery({
    query: getOneEmployee,
    variables: { id: user?.id },
    pause: !user?.id,
  });
  const { data, fetching, error } = result;

  const user_track_id = data?.data?.track_id || '';

  const fetchingIncoming = React.useCallback(async () => {
    setIsLoading(true);
    const url = 'tender-proposal/rejection-list';
    try {
      const rest = await axiosInstance.get(url, {
        headers: { 'x-hasura-role': activeRole! },
        params: {
          page: page,
          limit: limit,
          project_name: searchName || null,
          range_start_date: filterParams?.range_start_date || null,
          range_end_date: filterParams?.range_end_date || null,
          track_id: filterParams?.track_id || null,
        },
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
  }, [activeRole, enqueueSnackbar, currentLang, limit, page, filterParams, searchName]);

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
    if (activeRole === 'tender_project_manager') {
      if (user_track_id) {
        dispatch(getTrackList(0, activeRole! as string, 0, user_track_id));
      }
    } else {
      dispatch(getTrackList(0, activeRole! as string, 0));
    }
  }, [dispatch, activeRole, user_track_id]);

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

  // if (isFetching) return <>{translate('pages.common.loading')}</>;
  if (error) return <>{translate('pages.common.error')}</>;

  return (
    <ProjectManagementTableBE
      data-cy="rejection-list-table"
      headline={translate('rejection_list_table.headline')}
      isLoading={isFetching}
      data={projectManagementData ?? []}
      headerCell={headerCells}
      total={total || 0}
      table_type={'reject-project'}
      filterparams={filterParams}
      onChangeRowsPage={(rowPage: number) => {
        setLimit(rowPage);
      }}
      onFilterChange={setFilterParams}
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

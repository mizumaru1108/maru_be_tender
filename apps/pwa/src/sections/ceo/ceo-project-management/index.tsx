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
import { ProjectManagementFilterParams } from '../ceo-dashboard/ProjectManagement';

export interface tracks {
  id: string;
  name: string;
  with_consultation: boolean;
}

function CeoProjectManagement() {
  const { translate, currentLang } = useLocales();
  const dispatch = useDispatch();
  const { tracks, track_list } = useSelector((state) => state.proposal);
  const [projectManagementData, setProjectManagementData] = useState<ProjectManagement[]>([]);

  //fetching using API

  const [isFetching, setIsLoading] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const { activeRole } = useAuth();
  // const [cardData, setCardData] = React.useState([]);
  const [searchName, setSearchName] = useState('');

  // pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState<number | null>(null);
  const [filterParams, setFilterParams] = useState<ProjectManagementFilterParams>({
    range_start_date: null,
    range_end_date: null,
    track_id: null,
  });
  const fetchingIncoming = React.useCallback(async () => {
    setIsLoading(true);
    const url = `tender-proposal/request-in-process`;
    // console.log('rest', url);
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
      // console.log('rest', rest.data);
      // setTotal(rest.data.total);
      if (rest) {
        setTotal(rest.data.total);
        const tmpDatas = rest.data.data
          // .filter((item: any) => item.state === 'CEO')
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
              projectSection:
                (project &&
                  project.track_id &&
                  track_list &&
                  track_list.length > 0 &&
                  track_list.find((item: tracks) => item.id === project.track_id)?.name) ||
                '',
              associationName: (project.user.employee_name as string) || '',
              createdAt: (project.created_at as string) || '',
              projectDelay: getDelayProjects(project.created_at as string, currentLang.value) || '',
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

  React.useEffect(() => {
    fetchingIncoming();
    // fetchingPrevious();
  }, [fetchingIncoming]);

  useEffect(() => {
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

  // if (isFetching) return <>Loading</>;

  return (
    // <ProjectManagementTable
    //   headline={translate('project_management_table.headline')}
    //   isLoading={fetching || isLoading}
    //   headerCell={headerCells}
    //   data={projectManagementData ?? []}
    // />
    <React.Fragment>
      <ProjectManagementTableBE
        data-cy="project-management-table"
        headline={translate('project_management_table.headline')}
        isLoading={isFetching}
        data={projectManagementData ?? []}
        headerCell={headerCells}
        total={total || 0}
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
    </React.Fragment>
  );
}

export default CeoProjectManagement;

import {
  ProjectManagement,
  ProjectManagementTableHeader,
} from '../../../components/table/ceo/project-management/project-management';

import ProjectManagementTableBE from 'components/table/ceo/project-management/ProjectManagementTableBE';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { getTrackList } from 'redux/slices/proposal';
import { useDispatch, useSelector } from 'redux/store';
import useAuth from '../../../hooks/useAuth';
import useLocales from '../../../hooks/useLocales';
import axiosInstance from '../../../utils/axios';
import { generateHeader } from '../../../utils/generateProposalNumber';
import { getDelayProjects } from '../../../utils/get-delay-projects';
import { REOPEN_TMRA_4601ec1d4d7e4d96ae17ecf65e2c2006 } from 'config';

export interface tracks {
  id: string;
  name: string;
  with_consultation: boolean;
}

function DashboardProjectManagement() {
  const { translate, currentLang } = useLocales();
  const dispatch = useDispatch();
  const { track_list } = useSelector((state) => state.proposal);
  const [projectManagementData, setProjectManagementData] = useState<ProjectManagement[]>([]);

  const [isFetchingData, setIsLoading] = React.useState(true);
  const { enqueueSnackbar } = useSnackbar();
  const { activeRole } = useAuth();
  // const [cardData, setCardData] = React.useState([]);
  const [searchName, setSearchName] = useState('');

  // pagination
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState<number | null>(null);
  const [filter, setFilter] = useState('');
  const [filterValue, setFilterValue] = useState('');

  const fetchingIncoming = React.useCallback(async () => {
    setIsLoading(true);
    let url = '';
    if (filter && filterValue && filterValue !== 'all') {
      url = `tender-proposal/request-in-process?limit=${limit}&page=${page}&${filter}=${filterValue}`;
    } else {
      url = `tender-proposal/request-in-process?limit=${limit}&page=${page}`;
    }
    if (searchName && REOPEN_TMRA_4601ec1d4d7e4d96ae17ecf65e2c2006) {
      url = `${url}&project_name=${searchName}`;
    }
    // console.log('rest', url);
    try {
      const rest = await axiosInstance.get(url, {
        headers: { 'x-hasura-role': activeRole! },
      });
      // console.log('rest', rest.data);
      // setTotal(rest.data.total);
      if (rest) {
        setTotal(rest.data.total);
        const tmpDatas = rest.data.data.map((item: any) => ({
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
                  track_list.find((item: tracks) => item.id === project.track_id)!.name) ||
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
  }, [activeRole, enqueueSnackbar, currentLang, limit, page, filter, filterValue, searchName]);

  React.useEffect(() => {
    fetchingIncoming();
  }, [fetchingIncoming]);

  // useEffect(() => {
  //   dispatch(getTrackList(0, activeRole! as string));
  // }, [dispatch, activeRole]);

  const headerCells: ProjectManagementTableHeader[] = [
    {
      id: 'projectNumber',
      label: translate('project_management_headercell.project_number'),
      align: 'center',
    },
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
      {/* {!isFetchingData && !isLoading && (
        <ProjectManagementTable
          headline={translate('project_management_table.headline')}
          isLoading={isFetchingData}
          headerCell={headerCells}
          data={projectManagementData ?? []}
        />
      )} */}
      <ProjectManagementTableBE
        data-cy="project-management-table"
        headline={translate('project_management_table.headline')}
        isLoading={isFetchingData}
        data={projectManagementData ?? []}
        headerCell={headerCells}
        total={total || 0}
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
          // fetchingIncoming();
        }}
      />
      {/* {!loadingCount && (
      )} */}
    </>
  );
}

export default DashboardProjectManagement;

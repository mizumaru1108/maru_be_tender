import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import {
  RejectionListTableHeader,
  RejectionList,
} from '../../../components/table/ceo/rejection-list/rejection-list';
import RejectionListTable from '../../../components/table/ceo/rejection-list/RejectionListTable';
import { HASURA_ADMIN_SECRET, HASURA_GRAPHQL_URL } from '../../../config';

function CeoRejectionList() {
  const path = HASURA_GRAPHQL_URL;
  const secret = HASURA_ADMIN_SECRET;

  const [rejectionListData, setRejectionListData] = useState<RejectionList[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchRejectionList = useCallback(async (): Promise<RejectionList[] | null> => {
    const queryData = {
      query: `
        query GetRejectedList {
          proposal(where: {state: {_eq: CEO}, inner_status: {_eq: REJECTED}}, limit: 5) {
            projectNumber: id
            projectName: project_name
            projectSection: project_kind_id
            createdAt: created_at
          }
          proposal_aggregate(where: {state: {_eq: CEO}, inner_status: {_eq: REJECTED}}, limit: 5) {
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
      return response.data.data.proposal as RejectionList[];
    } catch (err) {
      console.log('Error:  ', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const initFetchRejectionList = useCallback(async () => {
    const projects = await fetchRejectionList();
    if (projects !== null && isLoading === false) {
      setRejectionListData(projects);
    }
  }, [fetchRejectionList]);

  useEffect(() => {
    initFetchRejectionList();
  }, []);

  useEffect(() => {
    console.log('rejectionListData: ', rejectionListData);
  }, [rejectionListData]);

  const headerCells: RejectionListTableHeader[] = [
    { id: 'projectNumber', label: 'Project Number' },
    { id: 'projectName', label: 'Project Name' },
    { id: 'associationName', label: 'Association Name', align: 'left' },
    { id: 'projectSection', label: 'Section', align: 'left' },
    { id: 'createdAt', label: 'Date Created', align: 'left' },
    { id: 'events', label: 'events', align: 'left' },
  ];

  return (
    <RejectionListTable
      headline="Rejection Lists"
      isLoading={isLoading}
      headerCell={headerCells}
      data={rejectionListData}
    />
  );
}

export default CeoRejectionList;

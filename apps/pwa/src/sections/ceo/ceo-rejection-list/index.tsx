import { useEffect, useState } from 'react';
import { useQuery } from 'urql';
import {
  RejectionList,
  RejectionListTableHeader,
} from '../../../components/table/ceo/rejection-list/rejection-list';
import RejectionListTable from '../../../components/table/ceo/rejection-list/RejectionListTable';
import { GetRejectionList } from '../../../queries/ceo/get-rejection-list';

function CeoRejectionList() {
  const [rejectionListData, setRejectionListData] = useState<RejectionList[]>([]);

  const [fetchRejectionList, setFetchRejectionList] = useQuery({
    query: GetRejectionList,
  });

  const { data: rejectionList, fetching, error } = fetchRejectionList;

  if (error) {
    console.log(error);
  }

  useEffect(() => {
    if (rejectionList) {
      setRejectionListData(rejectionList.proposal);
    }
  }, [rejectionList]);

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
      isLoading={fetching}
      headerCell={headerCells}
      data={rejectionListData}
    />
  );
}

export default CeoRejectionList;

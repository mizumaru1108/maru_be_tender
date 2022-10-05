import { useEffect, useState } from 'react';
import { useQuery } from 'urql';
import {
  RejectionList,
  RejectionListTableHeader,
} from '../../../components/table/ceo/rejection-list/rejection-list';
import RejectionListTable from '../../../components/table/ceo/rejection-list/RejectionListTable';
import useLocales from '../../../hooks/useLocales';
import { GetRejectionList } from '../../../queries/ceo/get-rejection-list';

function CeoRejectionList() {
  const { translate } = useLocales();
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
    { id: 'events', label: translate('project_management_headercell.events'), align: 'left' },
  ];

  return (
    <RejectionListTable
      headline={translate('rejection_list_table.headline')}
      isLoading={fetching}
      headerCell={headerCells}
      data={rejectionListData}
    />
  );
}

export default CeoRejectionList;

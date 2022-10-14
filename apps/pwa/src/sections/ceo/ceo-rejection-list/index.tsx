import { useEffect, useState } from 'react';
import { useQuery } from 'urql';
import {
  RejectionList,
  RejectionListTableHeader,
} from '../../../components/table/ceo/rejection-list/rejection-list';
import RejectionListTable from '../../../components/table/ceo/rejection-list/RejectionListTable';
import useAuth from '../../../hooks/useAuth';
import useLocales from '../../../hooks/useLocales';
import { GetMyRejectionList } from '../../../queries/ceo/get-my-rejection-list';

function CeoRejectionList() {
  const { translate } = useLocales();
  const { user } = useAuth();
  const [rejectionListData, setRejectionListData] = useState<RejectionList[]>([]);

  const [fetchRejectionList, setFetchRejectionList] = useQuery({
    query: GetMyRejectionList,
    variables: {
      reviewerId: user?.id,
    },
  });

  const { data: rejectionList, fetching, error } = fetchRejectionList;

  useEffect(() => {
    console.log(rejectionList);
  }, [rejectionList]);

  if (error) {
    console.log(error);
  }

  useEffect(() => {
    if (rejectionList) {
      // TODO: Find out how to map object out, so it's not remapped every time frontend get from Gql.
      // setRejectionListData(rejectionList.data.map((item: any) => item.proposal));
      setRejectionListData(
        rejectionList.data.map((project: any) => ({
          id: (project.proposal.projectNumber as string) || 'N/A',
          projectNumber: (project.proposal.projectNumber as string) || 'N/A',
          projectName: (project.proposal.projectName as string) || 'N/A',
          projectSection: project.proposal.projectSection || 'N/A',
          associationName:
            (project.proposal.associationName.client_data[0].entity as string) || 'N/A',
          createdAt: (project.proposal.createdAt as string) || 'N/A',
        }))
      );
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

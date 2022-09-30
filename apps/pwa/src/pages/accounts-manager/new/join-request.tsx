import { useEffect, useState } from 'react';
// material
import { Container, styled, Skeleton } from '@mui/material';
// components
import Page from 'components/Page';
import { TableAMCustom } from 'components/table';
// hooks
import { useQuery } from 'urql';
import { tableNewRequest } from 'queries/account_manager/clientNewRequest';
//
import { IPropsTablesList } from 'components/table/type';

// -------------------------------------------------------------------------------

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: '100%',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'start',
  flexDirection: 'column',
  rowGap: 42,
}));

// -------------------------------------------------------------------------------

function NewJoinRequestPage() {
  const [newJoinRequestData, setNewJoinRequestData] = useState<IPropsTablesList[] | null>(null);

  // Table New Request
  const [resultNewRequestQuery, reexecuteTableNewRequest] = useQuery({
    query: tableNewRequest,
  });

  const {
    data: resultNewRequest,
    fetching: fetchingNewRequest,
    error: errorNewRequest,
  } = resultNewRequestQuery;

  useEffect(() => {
    if (resultNewRequest) {
      const resultDataNR = resultNewRequest?.client_data.map((v: any) => ({
        id: v.id,
        partner_name: v.entity,
        createdAt: v.created_at,
        account_status: v.status,
        events: v.id,
      }));

      setNewJoinRequestData(resultDataNR);
    }
  }, [resultNewRequest]);

  return (
    <Page title="Incoming Join Request">
      <Container>
        <ContentStyle>
          {fetchingNewRequest && (
            <Skeleton variant="rectangular" sx={{ height: 250, borderRadius: 2 }} />
          )}
          {newJoinRequestData && (
            <TableAMCustom data={newJoinRequestData} headline="new_join_request" />
          )}
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default NewJoinRequestPage;

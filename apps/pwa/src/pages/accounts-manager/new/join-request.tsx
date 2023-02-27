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
import useLocales from '../../../hooks/useLocales';

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
  const { translate } = useLocales();
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
      const resultDataNR = resultNewRequest?.user.map((v: any) => ({
        id: v.id,
        partner_name: v.client_data.entity,
        createdAt: v.client_data.created_at,
        account_status: 'WAITING_FOR_ACTIVATION',
        events: v.id,
      }));

      setNewJoinRequestData(resultDataNR);
    }
  }, [resultNewRequest]);

  return (
    <Page title={translate('pages.account_manager.join_request')}>
      <Container>
        <ContentStyle>
          {fetchingNewRequest && (
            <Skeleton variant="rectangular" sx={{ height: 250, borderRadius: 2 }} />
          )}
          {newJoinRequestData && (
            <TableAMCustom
              data={newJoinRequestData}
              headline="account_manager.heading.new_join_request"
            />
          )}
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default NewJoinRequestPage;

import { useEffect, useState } from 'react';
// material
import { Container, styled, Skeleton } from '@mui/material';
// components
import Page from 'components/Page';
import { TableAMCustom } from 'components/table';
// hooks
import { useQuery } from 'urql';
import { tableInfoUpdateRequest } from 'queries/account_manager/clientNewRequest';
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

function InfoUpdateRequestPage() {
  const [infoUpdateRequest, setInfoUpdateRequest] = useState<IPropsTablesList[] | null>(null);

  const [resultInfoUpdateQuery, reexecuteInfoUpdateRequest] = useQuery({
    query: tableInfoUpdateRequest,
  });

  const {
    data: resultInfoUpdate,
    fetching: fetchingInfoUpdate,
    error: errorNewInfoUpdate,
  } = resultInfoUpdateQuery;

  useEffect(() => {
    if (resultInfoUpdate) {
      const resultDataInfoUpdate = resultInfoUpdate?.client_data?.map((v: any) => ({
        id: v.id,
        partner_name: v.entity,
        createdAt: v.created_at,
        account_status: v.status,
        events: v.id,
        update_status: v.status === 'REVISED_ACCOUNT' ? true : false,
      }));

      setInfoUpdateRequest(resultDataInfoUpdate);
    }
  }, [resultInfoUpdate]);

  return (
    <Page title="Information Update Request">
      <Container>
        <ContentStyle>
          {fetchingInfoUpdate && (
            <Skeleton variant="rectangular" sx={{ height: 250, borderRadius: 2 }} />
          )}
          {infoUpdateRequest && (
            <TableAMCustom data={infoUpdateRequest} headline="info_update_request" />
          )}
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default InfoUpdateRequestPage;

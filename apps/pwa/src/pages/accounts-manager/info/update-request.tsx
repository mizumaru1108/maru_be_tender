import { useEffect, useState } from 'react';
// material
import { Container, styled, Skeleton } from '@mui/material';
// components
import Page from 'components/Page';
import { TableAMCustom } from 'components/table';
// hooks
import { useQuery } from 'urql';
import { tableInfoUpdateRequest } from 'queries/account_manager/clientNewRequest';
import useAuth from 'hooks/useAuth';
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
  const { user } = useAuth();

  const [resultInfoUpdateQuery, reexecuteInfoUpdateRequest] = useQuery({
    query: tableInfoUpdateRequest,
    variables: {
      reviewer_id: user?.id,
    },
  });

  const {
    data: resultInfoUpdate,
    fetching: fetchingInfoUpdate,
    error: errorNewInfoUpdate,
  } = resultInfoUpdateQuery;

  useEffect(() => {
    if (resultInfoUpdate) {
      const resultDataInfoUpdate = resultInfoUpdate?.client_log?.map((vcl: any) => {
        const vcd = vcl.client_data;

        return {
          id: vcd.id,
          partner_name: vcd.entity,
          createdAt: vcd.created_at,
          account_status: vcd.status,
          events: vcd.id,
          update_status: true,
        };
      });

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

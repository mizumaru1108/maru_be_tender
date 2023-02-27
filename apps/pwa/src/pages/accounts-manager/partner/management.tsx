import { useEffect, useState } from 'react';
// material
import { Container, styled, Skeleton, Grid, Button } from '@mui/material';
// components
import Page from 'components/Page';
import { TableAMCustom } from 'components/table';
// hooks
import { useQuery } from 'urql';
import useAuth from 'hooks/useAuth';
import { getAllClient } from 'queries/account_manager/partnerManagement';
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
  rowGap: '50px',
}));

// -------------------------------------------------------------------------------

function PartnerManagementPage() {
  const { user } = useAuth();
  const { translate } = useLocales();
  const [clientData, setClientData] = useState<IPropsTablesList[] | null>(null);
  const [activeButton, setActiveButton] = useState<string>('ALL_CLIENT');

  // Table Client
  const [resultAllClient, reexecuteAllClient] = useQuery({
    query: getAllClient,
  });

  const {
    data: resultAllClientRequest,
    fetching: fetchingAllClientRequest,
    error: errorAllClientRequest,
  } = resultAllClient;

  useEffect(() => {
    if (!fetchingAllClientRequest && resultAllClientRequest) {
      const resultAllClientData = resultAllClientRequest?.user.map((v: any) => ({
        id: v.id,
        partner_name: v.client_data.entity,
        createdAt: v.client_data.updated_at,
        account_status: v.status_id,
        events: v.id,
        email: v.email,
      }));
      setClientData(resultAllClientData);
    }
  }, [fetchingAllClientRequest, resultAllClientRequest, activeButton]);

  if (fetchingAllClientRequest)
    return <Skeleton variant="rectangular" sx={{ height: 250, borderRadius: 2 }} />;

  return (
    // <Page title="Partner Management">
    <Page title={translate('pages.account_manager.partner_management')}>
      <Container>
        <ContentStyle>
          {clientData && (
            <>
              <TableAMCustom
                data={clientData}
                headline="account_manager.heading.partner_management"
                lengthRowsPerPage={10}
              />
            </>
          )}
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default PartnerManagementPage;

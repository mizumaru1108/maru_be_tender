import { useEffect, useState } from 'react';
// material
import { Container, Skeleton, styled } from '@mui/material';
// components
import Page from 'components/Page';
import { TableAMCustom } from 'components/table';
// hooks
import useAuth from 'hooks/useAuth';
import { getAllClient } from 'queries/account_manager/partnerManagement';
import { useQuery } from 'urql';
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
    if (!fetchingAllClientRequest && resultAllClientRequest && resultAllClientRequest?.user) {
      const resultAllClientData = resultAllClientRequest?.user.map((v: any) => ({
        id: v.id,
        partner_name:
          v && v.client_data && v.client_data.entity ? v.client_data.entity : v.employee_name,
        createdAt:
          v && v.client_data && v.client_data && v.client_data.updated_at
            ? v.client_data.updated_at
            : v.created_at,
        account_status: v.status_id,
        events: v.id,
        email: v.email,
      }));
      setClientData(resultAllClientData);
    }
  }, [fetchingAllClientRequest, resultAllClientRequest, activeButton]);
  // console.log({ clientData });

  // console.log({
  //   testAccount: resultAllClientRequest?.user.find(
  //     (item: any) => item.id === '5c1d3ef7-773a-4552-b8c5-dfd22ed72afd'
  //   ),
  //   testClientData:
  //     clientData &&
  //     clientData.find((item: any) => item.id === '5c1d3ef7-773a-4552-b8c5-dfd22ed72afd'),
  // });
  // if (fetchingAllClientRequest)
  //   return <Skeleton variant="rectangular" sx={{ height: 250, borderRadius: 2 }} />;

  return (
    // <Page title="Partner Management">
    <Page title={translate('pages.account_manager.partner_management')}>
      <Container>
        <ContentStyle>
          {clientData && !fetchingAllClientRequest ? (
            <>
              <TableAMCustom
                data={clientData}
                headline="account_manager.heading.partner_management"
                lengthRowsPerPage={10}
                refetch={reexecuteAllClient}
              />
            </>
          ) : (
            <Skeleton variant="rectangular" sx={{ height: 250, borderRadius: 2 }} />
          )}
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default PartnerManagementPage;

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

// -------------------------------------------------------------------------------

const CLIENT_STATUS = [
  {
    label: 'partner_management.button.all_partners',
    value: 'ALL_CLIENT',
  },
  {
    label: 'partner_management.button.new_partners',
    value: 'WAITING_FOR_ACTIVATION',
  },
  {
    label: 'partner_management.button.active_partners',
    value: 'ACTIVE_ACCOUNT',
  },
  {
    label: 'partner_management.button.rejected_partners',
    value: 'REVISED_ACCOUNT',
  },
  {
    label: 'partner_management.button.suspended_partners',
    value: 'SUSPENDED_ACCOUNT',
  },
];

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
      const resultAllClientData = resultAllClientRequest?.client_data.map((v: any) => ({
        id: v.id,
        partner_name: v.entity,
        createdAt: v.created_at,
        account_status: v.status,
        events: v.id,
      }));

      setClientData(resultAllClientData);
    }
  }, [fetchingAllClientRequest, resultAllClientRequest, activeButton]);

  return (
    <Page title="Partner Management">
      <Container>
        <ContentStyle>
          {fetchingAllClientRequest && (
            <Skeleton variant="rectangular" sx={{ height: 250, borderRadius: 2 }} />
          )}
          {clientData && (
            <>
              {/* <Grid container spacing={3} alignItems="center" justifyContent="flex-start">
                {CLIENT_STATUS.map((v, i) => (
                  <Grid item key={i}>
                    <Button
                      variant="contained"
                      onClick={() => {
                        setActiveButton(v.label);
                      }}
                    >
                      {v.label}
                    </Button>
                  </Grid>
                ))}
              </Grid> */}
              <TableAMCustom
                data={clientData}
                headline="partner_management"
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

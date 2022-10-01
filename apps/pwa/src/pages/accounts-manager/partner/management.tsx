import { useEffect, useState } from 'react';
// material
import { Container, styled, Skeleton } from '@mui/material';
// components
import Page from 'components/Page';
import { TableAMCustom } from 'components/table';
// mock
// import { AM_PARTNER_MANAGEMENT } from '../mock-data';
// hooks
import axios from 'axios';
import { HASURA_GRAPHQL_URL } from 'config';
//
import { IPropsTablesList } from 'components/table/type';

// -------------------------------------------------------------------------------

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: '100%',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'start',
  flexDirection: 'column',
  rowGap: '50px',
}));

function PartnerManagementPage() {
  const path = HASURA_GRAPHQL_URL;
  const secret = 'hbd4KbAS5XjHw5';

  const [newJoinRequestData, setNewJoinRequestData] = useState<IPropsTablesList[] | null>(null);

  const getNewJoinRequestData = async () => {
    const queryData = {
      query: `
        query MyQuery {
          client_data {
            created_at
            email
            id
            ceo_mobile
            ceo_name
          }
        }
      `,
    };

    const headers = {
      headers: {
        'Content-Type': 'aplication/json',
        'x-hasura-admin-secret': `${secret}`,
      },
    };

    await axios
      .post(`${path}`, queryData, headers)
      .then(({ data }) => {
        if (data.data) {
          const clientData = data?.data?.client_data.map((v: any) => ({
            id: v.id,
            partner_name: v.ceo_name,
            createdAt: v.created_at,
            account_status: 'waiting',
            events: v.email,
          }));

          setNewJoinRequestData(clientData);
          console.log('errorResponse', data.errors);
        }
      })
      .catch((err) => console.log('error', err.message));
  };

  useEffect(() => {
    getNewJoinRequestData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Page title="Partner Management">
      <Container>
        <ContentStyle>
          {newJoinRequestData ? (
            <TableAMCustom
              data={newJoinRequestData}
              headline="partner_management"
              lengthRowsPerPage={10}
            />
          ) : (
            <Skeleton variant="rectangular" sx={{ height: 250, borderRadius: 2 }} />
          )}
          {/* <TableAMCustom
            data={AM_PARTNER_MANAGEMENT}
            headline="partner_management"
            lengthRowsPerPage={10}
          /> */}
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default PartnerManagementPage;

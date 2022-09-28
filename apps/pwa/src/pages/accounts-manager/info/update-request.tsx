import { useEffect, useState } from 'react';
// material
import { Container, styled, Skeleton } from '@mui/material';
// components
import Page from 'components/Page';
import { TableAMCustom } from 'components/table';
// hooks
import axios from 'axios';
import { HASURA_GRAPHQL_URL, HASURA_ADMIN_SECRET } from 'config';
// mock
// import { AM_UPDATE_REQUEST } from '../mock-data';
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
  const path = HASURA_GRAPHQL_URL;
  const secret = HASURA_ADMIN_SECRET || 'hbd4KbAS5XjHw5';

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
    <Page title="Information Update Request">
      <Container>
        <ContentStyle>
          {newJoinRequestData ? (
            <TableAMCustom data={newJoinRequestData} headline="info_update_request" />
          ) : (
            <Skeleton variant="rectangular" sx={{ height: 250, borderRadius: 2 }} />
          )}
        </ContentStyle>
      </Container>
    </Page>
  );
}

export default InfoUpdateRequestPage;
